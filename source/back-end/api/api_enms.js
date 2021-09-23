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
        let sql =   " SELECT error_log.mac, error_log.`datetime`, error_log.event, equipment_info.factory, equipment_info.equipment "+
                    " FROM error_log INNER JOIN equipment_info ON equipment_info.mac = error_log.mac                                "+ 
                    " WHERE `datetime` > ? AND `datetime` < ? ORDER BY `datetime` DESC                                              ";
        let time = new Date().setTime(new Date() - 2000);
        sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date(time), 'yyyyMMddHHmmss'), utility.formattime(new Date(), 'yyyyMMddHHmmss')]);
        dbFactory.action_db(sql, statusData, res);
    }
}
