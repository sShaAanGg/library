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
        let sql =   " SELECT "                                  +
                        " mac, "                                + 
                        " SUM(CASE month(`datetime`) "          +
                    " WHEN "                                    + 
                        " '?' "                                 +
                    " THEN "                                    +
                        " ampere ELSE 0 END) AS sum_ampere "    + 
                    " FROM "                                    +
                        " enms_info "                           +
                    " WHERE "                                   +
                        " year(`datetime`) = ? "                + 
                    " GROUP BY "                                + 
                        " mac ";
        sql = dbFactory.build_mysql_format(sql, [month, year]);
        
        dbFactory.action_db_with_cb(sql, statusData, async(result) => {
            let insertSql = " INSERT INTO "         +
                                " history_info "    +
                                " (mac, "           +
                                " yearmonth, "      +
                                " electricity) "    +
                            " VALUES "              +
                                " (?, ?, ?) ";
            let ix = 0;
            let histiryResult = [];

            while (ix < result.length){
                if (ix === 0){
                    insertSql = dbFactory.build_mysql_format(insertSql, [   result[ix].mac, 
                                                                            year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
                                                                            // (result[ix].sum_ampere * 305) / 100000 每10秒紀錄一次資料的公式
                                                                            ((result[ix].sum_ampere * 305) / 100000).toFixed(2)]);
                    histiryResult.push({    mac:result[ix].mac,
                                            datetime: year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
                                            electricity: ((result[ix].sum_ampere * 305) / 100000).toFixed(2)});
                    ++ix;
                    continue;
                }

                insertSql +=`, (    ${result[ix].mac}, 
                                    ${year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000"}, 
                                    ${((result[ix].sum_ampere * 305) / 100000).toFixed(2)})`;
                
                histiryResult.push({    mac:result[ix].mac,
                                        datetime: year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + "00000000",
                                        electricity: ((result[ix].sum_ampere * 305) / 100000).toFixed(2)});
                ++ix;
            } 
            await dbFactory.asyncQuery(insertSql);  

            res.status(statusData.successCode).send(histiryResult);
        });
    }
}
