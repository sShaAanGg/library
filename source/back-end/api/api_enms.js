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
let statusDataCommon = {
    successCode: 200,
    errorCode: 500,
    errorMsg: " "
}                                    

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

        let sql =   " SELECT equipment_info.factory, SUM(ampere) AS sum_ampere FROM enms_info INNER JOIN equipment_info ON equipment_info.mac = enms_info.mac "+
                    " WHERE ampere != 0 AND `datetime` > ? AND `datetime` < ? GROUP BY equipment_info.factory; ";

        sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date(), 'yyyyMM01000000'), utility.formattime(new Date(), 'yyyyMMddHHmmss')]);
        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            let cumulativeElectricityConsumption = [];
            let ix = 0;
            
            // (result[ix].sum_ampere * 305) / 100000 每10秒紀錄一次資料的公式
            while (ix < result.length){
                cumulativeElectricityConsumption.push(((result[ix].sum_ampere * 305) / 100000).toFixed(2));
                ++ix;
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

        let time = new Date().setTime(new Date() - 60000);
        let sql =   " SELECT * FROM (Select id, mac, `datetime`, ampere, ROW_NUMBER() Over (Partition By mac Order By `datetime` Desc) As Sort  "+   
                    " FROM enms_info WHERE `datetime` > ? AND ampere != 0) enms_info                                                            "+
                    " WHERE Sort = 1                                                                                                            ";
        sql = dbFactory.build_mysql_format(sql, utility.formattime(new Date(time), 'yyyyMMddHHmmss'));

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            let real_time_electricity_consumption = 0;
            let ix = 0;

            while (ix < result.length){
                real_time_electricity_consumption += parseFloat((result[ix].ampere * 110 / 1000).toFixed(2));
                ++ix;
            }
            
            res.status(statusData.successCode).send(real_time_electricity_consumption.toString());
        });
    },

    select_two_years_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_two_years_electricity_consumption"
        };

        let sql = " SELECT * FROM history_info WHERE yearmonth > ? AND yearmonth < ? ";
        // let sql = " SELECT yearmonth, mac, SUM(electircity) FROM history_info WHERE yearmonth > ? AND yearmonth < ? group by mac";
        sql = dbFactory.build_mysql_format(sql, [   new Date().getFullYear()-1 + '0100000000', 
                                                    utility.formattime(new Date(), 'yyyy1200000000')]);
        
        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            res.status(statusData.successCode).send(result);
        });
    },

    select_event_log: function(req, res){
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_event_log"
        }
        let sql =   " SELECT error_log.mac, error_log.`start_datetime`, error_log.event, equipment_info.factory, equipment_info.equipment "+
                    " FROM error_log INNER JOIN equipment_info ON equipment_info.mac = error_log.mac                                "+ 
                    " WHERE `start_datetime` > ? AND `start_datetime` < ? ORDER BY `start_datetime` DESC                                              ";
        let time = new Date().setTime(new Date() - 2000);
        sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date(time), 'yyyyMMddHHmmss'), utility.formattime(new Date(), 'yyyyMMddHHmmss')]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_equip_controllers: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_equip_buttons";

        let sql =   "select DISTINCT equipment_controller.mac, equipment_controller.button_name, equipment_controller.button_type, " + 
                    "equipment_controller.button_port, equipment_controller.button_pin " +
                    "from equipment_controller " + 
                    "JOIN equipment_info ON equipment_controller.mac = equipment_info.mac " +
                    "JOIN machine_info ON equipment_info.machine_sn = machine_info.machine_sn " +
                    "WHERE machine_info.factory = ?";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.factory]);
        dbFactory.action_db(sql, statusDataCommon, res);

    },

    select_machine_list: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_machine_list";

        let sql = "SELECT machine_name, `type`, year_elec, month_elec, voltage, work_years, work_hours, activation FROM enms.machine_info ";
        if(req.body.data.factory) {
            let factorySql = sql + "where factory = ?";
            sql = dbFactory.build_mysql_format(factorySql, [req.body.data.factory]);
        }
        else {
            sql = dbFactory.build_mysql_format(sql);
        }
        
        dbFactory.action_db(sql, statusDataCommon, res);

    },

    select_data_year: function(req, res){
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_data_year"
        }

        let sql = " SELECT DATE_FORMAT(datetime,'%Y') as year FROM history_month_info GROUP BY year "

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            res.status(statusData.successCode).send(result);
        });
    },

    select_two_years_electricity_consumption_for_anslysis: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_two_years_electricity_consumption"
        };
        
        var param = req.body.data;
        let sql;

        if (param.analysisMode === 'year'){
            if (param.factory){
                sql =   " SELECT DATE_FORMAT(history_month_info.datetime,'%Y-%m') as datetime, history_month_info.electricity, history_month_info.carbon_footprint, history_month_info.carbon_negative, "                     +
                " machine_info.machine_name, machine_info.factory, machine_info.type FROM ((history_month_info INNER JOIN equipment_info ON history_month_info.mac = equipment_info.mac) INNER JOIN machine_info ON "         +
                " equipment_info.machine_sn = machine_info.machine_sn) WHERE history_month_info.datetime >= ? AND history_month_info.datetime < ? AND machine_info.factory = ? "                                                                           
                sql = dbFactory.build_mysql_format(sql, [   new Date(param.date).getFullYear()-1  + '0100000000', 
                                                            new Date(param.date).getFullYear()+1 + '0100000000',
                                                            param.factory]);
            } else {
                sql =   " SELECT DATE_FORMAT(history_month_info.datetime,'%Y-%m') as datetime, history_month_info.electricity, history_month_info.carbon_footprint, history_month_info.carbon_negative, "      +
                " machine_info.machine_name, machine_info.factory, machine_info.type FROM ((history_month_info INNER JOIN equipment_info ON history_month_info.mac = equipment_info.mac) "                     +
                " INNER JOIN machine_info ON equipment_info.machine_sn = machine_info.machine_sn) WHERE history_month_info.datetime >= ? AND history_month_info.datetime < ? "                                 
                sql = dbFactory.build_mysql_format(sql, [   new Date(param.date).getFullYear()-1  + '0100000000', 
                                                            new Date(param.date).getFullYear()+1 + '0100000000']);
            }
        }


        if (param.analysisMode === 'month'){
            let date1 = new Date(param.date).getFullYear()-1;
            let date2 = new Date(param.date).getFullYear();

            if (new Date(param.date).getMonth() < 9){
                date1 += '0' + (new Date(param.date).getMonth()+1) + '00000000';
                date2 += '0' + (new Date(param.date).getMonth()+2) + '00000000';
            } else {
                date1 += (new Date(param.date).getMonth()+1) + '00000000';
                date2 += (new Date(param.date).getMonth()+2) + '00000000';
            }

            if (param.factory){
                sql =   " SELECT DATE_FORMAT(history_day_info.datetime,'%Y-%m-%d') as datetime, history_day_info.electricity, history_day_info.carbon_footprint, history_day_info.carbon_negative, "                        +
                " machine_info.machine_name, machine_info.factory, machine_info.type FROM ((history_day_info INNER JOIN equipment_info ON history_day_info.mac = equipment_info.mac) INNER JOIN machine_info ON "           +
                " equipment_info.machine_sn = machine_info.machine_sn) WHERE history_day_info.datetime >= ? AND history_day_info.datetime < ? AND machine_info.factory = ?"
                sql = dbFactory.build_mysql_format(sql, [   date1, 
                                                            date2,
                                                            param.factory]);
            } else {
                sql =   " SELECT DATE_FORMAT(history_day_info.datetime,'%Y-%m-%d') as datetime, history_day_info.electricity, history_day_info.carbon_footprint, history_day_info.carbon_negative,"                         +
                " machine_info.machine_name, machine_info.factory, machine_info.type FROM ((history_day_info INNER JOIN equipment_info ON history_day_info.mac = equipment_info.mac)"                                       +
                " INNER JOIN machine_info ON equipment_info.machine_sn = machine_info.machine_sn) WHERE history_day_info.datetime >= ? AND history_day_info.datetime < ? "                                                                                            
                sql = dbFactory.build_mysql_format(sql, [   date1, 
                                                            date2]);
            }
        }

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            res.status(statusData.successCode).send(result);
        });
    },

    select_error_log: function(req, res){
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_data_year"
        }

        let sql = " SELECT machine_info.machine_sn, machine_info.machine_name, DATE_FORMAT(error_log.start_datetime,'%Y-%m-%d %H:%i:%s') as start_datetime, "       +
            " DATE_FORMAT(error_log.end_datetime,'%Y-%m-%d %H:%i:%s') as end_datetime, error_log.event FROM "                                                       +
            " ((error_log INNER JOIN equipment_info ON error_log.mac = equipment_info.mac)  INNER JOIN machine_info ON equipment_info.machine_sn = machine_info.machine_sn) "

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            res.status(statusData.successCode).send(result);
        });
    },
}
