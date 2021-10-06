const path = require('path');
var db = require('../utility/DbFactory');
var utility = require('../utility/utils');

// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

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

let statusData = {
    successCode: 200,
    errorCode: 500,
    errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
};

let eventLog = "功率過高";
let sql = " INSERT INTO error_log (mac, `start_datetime`, end_datetime, event) VALUES(?, ?, ?, ?) ";
                        

// open connection to a tcp line
client.connectTCP("192.168.4.40", { port: 502 });
client.setID(1);

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
var lastCount = 0;
var hasTrigger = false;
setInterval(function() {
    client.readInputRegisters(17, 8)
        .then((data)=>{
            if (!hasTrigger) {
                lastCount = data.data;
                hasTrigger = true;
            } 
            else {
                if ( parseInt(data.data[0]) != lastCount[0]){
                    let insertSql = dbFactory.build_mysql_format(sql, ["11111111" ,utility.formattime(new Date(), 'yyyyMMddHHmmss'),  utility.formattime(new Date(), 'yyyyMMddHHmmss'), eventLog]);
                    console.log(insertSql);
                    dbFactory.action_db_with_cb(insertSql, statusData, ()=>{
                    });
                }
                if ( parseInt(data.data[2]) != lastCount[2]){
                    let insertSql = dbFactory.build_mysql_format(sql, ["22222222" ,utility.formattime(new Date(), 'yyyyMMddHHmmss'), utility.formattime(new Date(), 'yyyyMMddHHmmss'), eventLog]);
                    console.log(insertSql);
                    dbFactory.action_db_with_cb(insertSql, statusData, ()=>{
                    });
                }
                if ( parseInt(data.data[4]) != lastCount[4]){
                    let insertSql = dbFactory.build_mysql_format(sql, ["33333333" ,utility.formattime(new Date(), 'yyyyMMddHHmmss'), utility.formattime(new Date(), 'yyyyMMddHHmmss'), eventLog]);
                    console.log(insertSql);
                    dbFactory.action_db_with_cb(insertSql, statusData, ()=>{
                    });
                }
                lastCount = data.data;
            }
            console.log(data.data);

        })
        .catch((err)=>{
            console.log(err);
        })
}, 1000);

