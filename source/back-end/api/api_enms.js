const path = require('path');
var db = require('../utility/DbFactory');
var utility = require('../utility/utils');
const net = require("net");
const { time } = require('console');

const dotenvAbsolutePath = path.join(__dirname, '../.env');
const dotenv = require('dotenv').config({path: dotenvAbsolutePath});

if (dotenv.error){
    throw dotenv.error;
}

let dbFactory = new db.DbFactory(   process.env.DB_HOST,
                                    process.env.DB_USER,
                                    process.env.DB_PASS,
                                    process.env.DB_NAME,
                                    process.env.DB_PORT,
                                    true);

module.exports = {
    /*========================================================== */
    //  tcp client
    /*========================================================== */
    send_switch_socket: function(req, res) {

        // console.log('[Back end] send_switch_socket');

        var param = req.body.data;
        var hexStr;

        // console.log(param);

        switch (param) {
            case 'light_on':
                hexStr = "54414349002100124B0018E4685410320000000000000006000300000010";
                break;
            case 'light_off':
                hexStr = "54414349002100124B0018E4685410320000000000000006010300000010";
                break;
            case 'fan_on':
                hexStr = "54414349002100124B0018E467A010320000000000000006000300000010";
                break;
            case 'fan_off':
                hexStr = "54414349002100124B0018E467A010320000000000000006010300000010";
                break;
        }

        let client = net.Socket();
        let msg = '';

        client.setTimeout(5000);

        client.connect(15476, '192.168.4.11', () => {
            const cmdData = Uint8Array.from(Buffer.from(hexStr, 'hex'));

            client.write(cmdData);

            msg = {status: 'success'};
        })

        client.on("timeout", () => {
            msg = {status: 'Timeout'};
            client.destroy();
        })

        client.on('error', (err) => {
            msg = {status: err};
            client.end();
        })

        /* 監聽end事件 */
        client.on("data", function (data) {
            // console.log("the data of server is " + data.toString());
        })

        client.on('end', () => {
            // console.log('[Back end]' + msg);
            res.send(msg);
            client.end();
        })
    },
    
    /*========================================================== */
    //  enms api
    /*========================================================== */
    
    select_current_month_cumulative_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };

        let sql =   " SELECT machine_info.factory, equipment_info.machine_sn, machine_info.voltage, SUM(ampere) AS 'sum_ampere' "+
                    " FROM ((enms_info inner join equipment_info on enms_info.mac = equipment_info.mac)                         "+
                    " inner join machine_info on equipment_info.machine_sn = machine_info.machine_sn)                           "+
                    " WHERE enms_info.`datetime` < ? AND enms_info.`datetime` > ?                                               "+
                    " group by machine_info.machine_sn                                                                          ";
        sql = dbFactory.build_mysql_format(sql, [   utility.formattime(new Date().setMonth(new Date().getMonth()-1), 'yyyyMMddHHmmss'), 
                                                    utility.formattime(new Date().setMonth(new Date().getMonth()-1), 'yyyyMM01000000')]);

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            let cumulativeElectricityConsumption = [];  
            let sumArray = [];
            let factoryEle = 0;
            let ix = 0, iy = 0;

            Array.prototype.groupBy = function(prop) {
                return this.reduce(function(groups, item) {
                const val = item[prop]
                groups[val] = groups[val] || []
                groups[val].push(item)
                return groups
                }, {})
            };

            while(ix < Object.keys(result.groupBy('factory')).length){
                sumArray = [];
                sumArray = result.groupBy('factory')[Object.keys(result.groupBy('factory'))[ix]];
                iy = 0;
                factoryEle = 0;
                while(iy < sumArray.length){
                    factoryEle += (sumArray[iy].voltage * sumArray[iy].sum_ampere)/360000;
                    ++ iy;
                }
                cumulativeElectricityConsumption.push(Object.keys(result.groupBy('factory'))[ix], factoryEle.toFixed(2));
                ++ ix;
            }
            res.status(statusData.successCode).send(cumulativeElectricityConsumption);
        });
    },

    select_real_time_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_real_time_electricity_consumption"
        };

        let time = new Date().setMonth(new Date().getMonth()-1);

        let sql =   " SELECT real_time_total.mac, real_time_total.`datetime`, real_time_total.ampere, real_time_total.machine_sn, machine_info.voltage                  "+
                    " FROM machine_info, (SELECT real_time_info.mac, real_time_info.`datetime`, real_time_info.ampere, equipment_info.machine_sn                        "+
                    " FROM equipment_info, (SELECT * FROM (Select id, mac, `datetime`, ampere, ROW_NUMBER() Over (Partition By mac Order By `datetime` Desc) As Sort    "+ 
                    " FROM enms_info WHERE `datetime` < ? AND `datetime` > ? AND ampere != 0) enms_info WHERE Sort = 1)real_time_info                                   "+
                    " WHERE equipment_info.mac = real_time_info.mac) real_time_total WHERE machine_info.machine_sn = real_time_total.machine_sn                         ";
        sql = dbFactory.build_mysql_format(sql, [   utility.formattime(new Date(time), 'yyyyMMddHHmmss'),
                                                    utility.formattime(new Date(time).setTime(time - 60000), 'yyyyMMddHHmmss')]);

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            let real_time_electricity_consumption = 0;
            let ix = 0;

            while (ix < result.length){
                real_time_electricity_consumption += parseFloat((result[ix].ampere * result[ix].voltage / 1000).toFixed(2));
                ++ix;
            }
            
            res.status(statusData.successCode).send(real_time_electricity_consumption.toString());
        });
    },

    select_two_years_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_two_years_electricity_consumption "
        };

        let sql =   " SELECT                                                        "+
                    " history_month_info.electricity,                               "+
                    " history_month_info.`datetime`,                                "+
                    " history_month_info.watt,                                      "+
                    " history_month_info.carbon_footprint,                          "+ 
                    " history_month_info.carbon_negative                            "+
                    " FROM history_month_info                                       "+
                    " WHERE `datetime` > ? AND `datetime` < ? group by `datetime`   ";
        sql = dbFactory.build_mysql_format(sql, [   new Date().getFullYear()-1 + '01000000', 
                                                    utility.formattime(new Date(), 'yyyy1200000000')]);
        console.log(sql);
        dbFactory.action_db(sql, statusData, res);
    },

    select_event_log: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_event_log"
        };

        let sql =   " SELECT error_log.mac, error_log.`datetime`, error_log.event, equipment_info.factory, equipment_info.equipment "+
                    " FROM error_log INNER JOIN equipment_info ON equipment_info.mac = error_log.mac                                "+ 
                    " WHERE `datetime` > ? AND `datetime` < ? ORDER BY `datetime` DESC                                              ";

        let time = new Date().setTime(new Date() - 2000);
        sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date(time), 'yyyyMMddHHmmss'), utility.formattime(new Date(), 'yyyyMMddHHmmss')]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_machine_manage: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_machine_manage"
        };
        
        if (req.body.data.searchFactory.length !== 0){
            let sql = " SELECT * FROM machine_info WHERE factory = ?";
            sql = dbFactory.build_mysql_format(sql, [req.body.data.searchFactory]);
            dbFactory.action_db(sql, statusData, res);
        } else {
            let sql = "SELECT * FROM machine_info";
            dbFactory.action_db(sql, statusData, res);
        }
    },

    insert_machine_manage: function(req, res) {
        let example = [ 'factory', 
                        'machineName', 
                        'machineSn', 
                        'machineType', 
                        'establishDate',
                        'updateDate', 
                        'machineVolt', 
                        'yearElec', 
                        'monthElec', 
                        'machineAge', 
                        'workHours', 
                        'activation'];

        if (false === utility.data_check(req.body.data, example)){
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        }

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while insert_machine_manage"
        };
        
            let sql = " INSERT INTO machine_info (machine_name, machine_sn, `type`, "+ 
                      " factory, establish_date, update_date, year_elec, month_elec,"+
                      " voltage, work_years, work_hours, activation)                "+ 
                      " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)                 ";
            sql = dbFactory.build_mysql_format(sql, [   req.body.data.machineName, 
                                                        req.body.data.machineSn, 
                                                        req.body.data.machineType, 
                                                        req.body.data.factory, 
                                                        req.body.data.establishDate,
                                                        req.body.data.updateDate,
                                                        req.body.data.yearElec,
                                                        req.body.data.monthElec,
                                                        req.body.data.machineVolt,
                                                        req.body.data.machineAge,
                                                        req.body.data.workHours,
                                                        req.body.data.activation]);
            dbFactory.action_db(sql, statusData, res);
    },

    update_machine_manage: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while update_machine_manage"
        };
        
            let sql = " UPDATE machine_info SET machine_name = ?, machine_sn = ?, `type` = ?, factory = ?, voltage = ?, work_years = ? WHERE id = ?";
            sql = dbFactory.build_mysql_format(sql, [   req.body.data.machineName, 
                                                        req.body.data.machineSn, 
                                                        req.body.data.machineType, 
                                                        req.body.data.factory, 
                                                        req.body.data.machineVolt,
                                                        req.body.data.machineAge,
                                                        req.body.data.id]);
            dbFactory.action_db(sql, statusData, res);
    },

    delete_machine_manage: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while insert_machine_manage"
        };
        
        let sql = " DELETE FROM machine_info WHERE id = ? ";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.id]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_machine_sn: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while insert_machine_manage"
        };
        
        let sql = " SELECT * FROM machine_info WHERE machine_sn = ? ";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.machineSn]);
        dbFactory.action_db(sql, statusData, res);
    }
}
