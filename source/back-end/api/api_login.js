const path = require('path');
var db = require('../utility/DbFactory');
var utility = require('../utility/utils');
var fs = require("fs");

var sha256 = require('js-sha256').sha256;


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
// let statusDataCommon = {
//     successCode: 201,
//     errorCode: 500,
//     errorMsg: " "
// };

const axiosConfig = {
    headers: {
        "License-Key": '2ebed68cc4c1d3ad38d3ca348b468f93cf3833a1a9cb7d29adb1a277fde79b72'
    }
};


module.exports = {

    login: function(req, res){
        let example = ['account', 'password'];
<<<<<<< HEAD
        console.log(req.body);
=======

>>>>>>> b1d0251962a764da3029a4f964128e7288272946
        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "      +
                        " * "       +
                    " FROM "        +
                        " account " +
                    " WHERE "       +
                        "( account = ? AND password = ? )";

        sql = dbFactory.build_mysql_format(sql,[req.body.data.account,sha256(req.body.data.password)]);
<<<<<<< HEAD
=======

>>>>>>> b1d0251962a764da3029a4f964128e7288272946
        dbFactory.action_db(sql, statusData, res);
    },
    register: function(req, res){
        let example = ['account', 'password'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " INSERT INTO"      +
                        " * "       +
                    " FROM "        +
                        " account " +
                    " WHERE "       +
                        " account = ? AND password = ? ";

        sql = dbFactory.build_mysql_format(sql,[req.body.data.account,sha256(req.body.data.password)]);

        dbFactory.action_db(sql, statusData, res);
    }

}
