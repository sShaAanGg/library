// const path = require('path');
// var db = require('../utility/DbFactory');
// var utility = require('../utility/utils');
// const net = require("net");
// const { time } = require('console');
// const axios = require('axios');

// const dotenvAbsolutePath = path.join(__dirname, '../.env');
// const dotenv = require('dotenv').config({path: dotenvAbsolutePath});

// if (dotenv.error){
//     throw dotenv.error;
// }

// const axiosConfig = {
//     headers: {
//         "License-Key": '2ebed68cc4c1d3ad38d3ca348b468f93cf3833a1a9cb7d29adb1a277fde79b72'
//     }
// }

// let statusData = {
//     successCode: 200,
//     errorCode: 500,
//     errorMsg: ""
// };

// let dbFactory = new db.DbFactory(   process.env.DB_HOST,
//                                     process.env.DB_USER,
//                                     process.env.DB_PASS,
//                                     process.env.DB_NAME,
//                                     process.env.DB_PORT,
//                                     true);

// module.exports = {
//     /*========================================================== */
//     //  cron api
//     /*========================================================== */
//     // insert_history_month_cumulative_electricity_consumption: function(req, res){
//     //     statusDataCommon['errorMsg'] = "Some error occurred while insert_history_month_cumulative_electricity_consumption";

//     //     let month;
//     //     let year;

//     //     if (new Date().getMonth() === 0){
//     //     //處理一月份跨年度問題
//     //         year = new Date().getFullYear()-1;
//     //         month = 12;
//     //     } else {
//     //         month = new Date().getMonth();
//     //         year = new Date().getFullYear();
//     //     }

//     //     //last month data
//     //     let sql =   " SELECT "                                  +
//     //                     " mac, "                                +
//     //                     " SUM(CASE month(`datetime`) "          +
//     //                 " WHEN "                                    +
//     //                     " '?' "                                 +
//     //                 " THEN "                                    +
//     //                     " ampere ELSE 0 END) AS sum_ampere "    +
//     //                 " FROM "                                    +
//     //                     " enms_info "                           +
//     //                 " WHERE "                                   +
//     //                     " year(`datetime`) = ? "                +
//     //                 " GROUP BY "                                +
//     //                     " mac ";
//     //     sql = dbFactory.build_mysql_format(sql, [month, year]);

//     //     dbFactory.action_db_with_cb(sql, statusData, async(result) => {
//     //         let insertSql = " INSERT INTO "         +
//     //                             " history_info "    +
//     //                             " (mac, "           +
//     //                             " yearmonth, "      +
//     //                             " electricity) "    +
//     //                         " VALUES "              +
//     //                             " (?, ?, ?) ";
//     //         let ix = 0;
//     //         let histiryResult = [];

//     //         while (ix < result.length){
//     //             if (ix === 0){
//     //                 insertSql = dbFactory.build_mysql_format(insertSql, [   result[ix].mac,
//     //                                                                         year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
//     //                                                                         // (result[ix].sum_ampere * 305) / 100000 每10秒紀錄一次資料的公式
//     //                                                                         ((result[ix].sum_ampere * 305) / 100000).toFixed(2)]);
//     //                 histiryResult.push({    mac:result[ix].mac,
//     //                                         datetime: year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
//     //                                         electricity: ((result[ix].sum_ampere * 305) / 100000).toFixed(2)});
//     //                 ++ix;
//     //                 continue;
//     //             }

//     //             insertSql +=`, (    ${result[ix].mac},
//     //                                 ${year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000"},
//     //                                 ${((result[ix].sum_ampere * 305) / 100000).toFixed(2)})`;

//     //             histiryResult.push({    mac:result[ix].mac,
//     //                                     datetime: year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
//     //                                     electricity: ((result[ix].sum_ampere * 305) / 100000).toFixed(2)});
//     //             ++ix;
//     //         }
//     //         await dbFactory.asyncQuery(insertSql);

//     //         res.status(statusData.successCode).send(histiryResult);
//     //     });
//     // },

//     check_button_and_change_button_status: function(req, res) {
//         statusData['errorMsg'] = "Some error occurred while check_button_and_change_button_status";

//         let sql =   " SELECT "  +
//                         " * "   +
//                     " FROM "    +
//                         " equipment_controller ";
//         dbFactory.action_db_with_cb(sql, statusData, (result) => {
//             let readData = {
//                 "port": "",
//                 "pin": 0,
//                 "deviceCount": 0,
//                 "devices": []
//             }

//             let setData = {
//                 "port":"",
//                 "pin":0,
//                 "control":0,
//                 "deviceCount":0,
//                 "devices":[]
//             };

//             for (let ix = 0; ix < result.length; ++ix){
//                 //未完成全部port,pin篩選功能
//                 if ( result[ix].button_port !== readData.port &&
//                      result[ix].button_pin !== readData.pin ){

//                     readData.port = result[ix].button_port;
//                     readData.pin = result[ix].button_pin;
//                     readData.deviceCount ++;
//                     readData.devices.push({ "mac": result[ix].mac });

//                     if (result.button_status == 1){
//                         setData.port = result[ix].button_port;
//                         setData.pin = result[ix].button_pin;
//                         setData.control = 1;
//                         setData.deviceCount ++;
//                         setData.devices.push({ "mac": result[ix].mac });
//                     } else {
//                         setData.port = result[ix].button_port;
//                         setData.pin = result[ix].button_pin;
//                         setData.control = 0;
//                         setData.deviceCount ++;
//                         setData.devices.push({ "mac": result[ix].mac });
//                     }
//                 } else if ( result[ix].button_port == readData.port &&
//                             result[ix].button_pin == readData.pin){

//                             readData.deviceCount ++;
//                             readData.devices.push({ "mac": result[ix].mac });

//                             if (result.button_status == 1){
//                                 setData.control = 1;
//                                 setData.deviceCount ++;
//                                 setData.devices.push({ "mac": result[ix].mac });
//                             } else {
//                                 setData.control = 0;
//                                 setData.deviceCount ++;
//                                 setData.devices.push({ "mac": result[ix].mac });
//                             }
//                 }
//             }
//             console.log(process.env.RESTFUL_IP);
//             console.log(readData);
//             console.log(setData);
//             res.status(statusData.successCode).send(readData);
//             axios
//                 .post(process.env.RESTFUL_IP + 'setgpio', data, axiosConfig)
//                 .then( (setgpioRes) => {
//                     conhsole.log(setgpioRes);
//                     axios
//                         .post(process.env.RESTFUL_IP + 'readgpio', data, axiosConfig)
//                         .then((readgpioRes) => {
//                             let updateSql = " UPDATE "                      +
//                                                 " equipment_controller "    +
//                                             " SET "                         +
//                                                 " button_status = ? "       +
//                                             " WHERE "                       +
//                                                 " mac = ? ";
//                             let sql = "";
//                             for (let iy = 0;iy < readgpioRes.length; ++iy){
//                                 sql += dbFactory.build_mysql_format(updateSql, [readgpioRes[iy].button_status, readgpioRes[iy].mac]);
//                             }
//                             dbFactory.action_db_with_cb(sql, statusData, (res) => {
//                                 let checkSql =  " SELECT "  +
//                                                     " * "   +
//                                                 " FROM "    +
//                                                     " equipment_controller ";
//                                 dbFactory.action_db_with_cb(checkSql, statusData, (checkRes) => {
//                                     console.log(checkRes);
//                                     //以下比對checkRes readgpioRes

//                                 })
//                             });

//                         })
//                         .catch((error) => console.log(error))
//                 })
//                 .catch( (error) => console.log(error));
//         });
//     }
// }
