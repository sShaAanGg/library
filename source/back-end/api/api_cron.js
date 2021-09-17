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
    //  cron api
    /*========================================================== */
    insert_history_month_cumulative_electricity_consumption: function(req, res){
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while insert_history_month_cumulative_electricity_consumption"
        };

        let month;
        let year;
        
        if (new Date().getMonth() === 0){
        //處理一月份跨年度問題
            year = new Date().getFullYear()-1;
            month = 12;
        } else {
            month = new Date().getMonth();
            year = new Date().getFullYear();
        }

        //last month data
        let sql =   " SELECT                                                                    "+
                    " mac,                                                                      "+ 
                    " SUM(CASE month(`datetime`) WHEN '?' THEN ampere ELSE 0 END) AS sum_ampere "+ 
                    " FROM enms_info                                                            "+
                    " WHERE year(`datetime`)= ? GROUP BY mac                                    ";
        sql = dbFactory.build_mysql_format(sql, [month, year]);
        
        dbFactory.action_db_with_cb(sql, statusData, async(result) => {
            let sql = "INSERT INTO history_info (mac, yearmonth, electricity) VALUES(?, ?, ?)";
            let ix = 0;
            let histiryResult = [];

            while (ix < result.length){
                sql = dbFactory.build_mysql_format(sql, [   result[ix].mac, 
                                                            year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
                                                            // (result[ix].sum_ampere * 305) / 100000 每10秒紀錄一次資料的公式
                                                            ((result[ix].sum_ampere * 305) / 100000).toFixed(2)]);
                histiryResult.push({    mac:result[ix].mac,
                                        datetime: year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
                                        electricity: ((result[ix].sum_ampere * 305) / 100000).toFixed(2)});
                await dbFactory.asyncQuery(sql);
                ++ix;
            }

            res.status(statusData.successCode).send(histiryResult);
        });
    }
}

// //last year data
// let sql =   " SELECT                                                                    "+ 
//             " SUM(CASE month(`datetime`) WHEN '1' THEN ampere ELSE 0 END) AS last_jan,  "+ 
//             " SUM(CASE month(`datetime`) WHEN '2' THEN ampere ELSE 0 END) AS last_feb,  "+
//             " SUM(CASE month(`datetime`) WHEN '3' THEN ampere ELSE 0 END) AS last_mar,  "+
//             " SUM(CASE month(`datetime`) WHEN '4' THEN ampere ELSE 0 END) AS last_apr,  "+
//             " SUM(CASE month(`datetime`) WHEN '5' THEN ampere ELSE 0 END) AS last_may,  "+
//             " SUM(CASE month(`datetime`) WHEN '6' THEN ampere ELSE 0 END) AS las_jun,   "+
//             " SUM(CASE month(`datetime`) WHEN '7' THEN ampere ELSE 0 END) AS lsat_jul,  "+
//             " SUM(CASE month(`datetime`) WHEN '8' THEN ampere ELSE 0 END) AS last_aug,  "+
//             " SUM(CASE month(`datetime`) WHEN '9' THEN ampere ELSE 0 END) AS last_sep,  "+
//             " SUM(CASE month(`datetime`) WHEN '10' THEN ampere ELSE 0 END) AS last_oca, "+
//             " SUM(CASE month(`datetime`) WHEN '11' THEN ampere ELSE 0 END) AS last_nov, "+
//             " SUM(CASE month(`datetime`) WHEN '12' THEN ampere ELSE 0 END) AS last_dec  "+
//             " from enms_info                                                            "+
//             " where year(`datetime`)= ?                                                 ";
// sql = dbFactory.build_mysql_format(sql, [new Date().getFullYear()-1,'yyyy']);
// console.log(sql);
// //this yeay data
// dbFactory.action_db_with_cb(sql, statusData, (result) => {
//     let lastYearData = result;
//     let sql =   " SELECT                                                                    "+ 
//                 " SUM(CASE month(`datetime`) WHEN '1' THEN ampere ELSE 0 END) AS this_jan,  "+ 
//                 " SUM(CASE month(`datetime`) WHEN '2' THEN ampere ELSE 0 END) AS this_feb,  "+
//                 " SUM(CASE month(`datetime`) WHEN '3' THEN ampere ELSE 0 END) AS this_mar,  "+
//                 " SUM(CASE month(`datetime`) WHEN '4' THEN ampere ELSE 0 END) AS this_apr,  "+
//                 " SUM(CASE month(`datetime`) WHEN '5' THEN ampere ELSE 0 END) AS this_may,  "+
//                 " SUM(CASE month(`datetime`) WHEN '6' THEN ampere ELSE 0 END) AS this_jun,  "+
//                 " SUM(CASE month(`datetime`) WHEN '7' THEN ampere ELSE 0 END) AS this_jul,  "+
//                 " SUM(CASE month(`datetime`) WHEN '8' THEN ampere ELSE 0 END) AS this_aug,  "+
//                 " SUM(CASE month(`datetime`) WHEN '9' THEN ampere ELSE 0 END) AS this_sep,  "+
//                 " SUM(CASE month(`datetime`) WHEN '10' THEN ampere ELSE 0 END) AS this_oca, "+
//                 " SUM(CASE month(`datetime`) WHEN '11' THEN ampere ELSE 0 END) AS this_nov, "+
//                 " SUM(CASE month(`datetime`) WHEN '12' THEN ampere ELSE 0 END) AS this_dec  "+
//                 " from enms_info                                                            "+
//                 " where year(`datetime`)= ?                                                 ";
//     sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date().getFullYear(),'yyyy')]);
//     dbFactory.action_db_with_cb(sql, statusData, (result) => {
//         let thisYearData = result;
//         res.status(statusData.successCode).send(lastYearData,thisYearData);
//     })
// });
