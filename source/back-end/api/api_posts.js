const path = require('path');
var db = require('../utility/DbFactory');
var utility = require('../utility/utils');
var fs = require("fs");
const axios = require('axios');

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

module.exports = {

    show_post: function(req, res){

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };

        var sql =   " SELECT "      +
                        " * "       +
                    " FROM "        +
                        " post ";


        // sql = dbFactory.build_mysql_format(sql,[req.body.data.account,sha256(req.body.data.password)]);

        dbFactory.action_db(sql, statusData, res);
    },
    show_search: function(req, res){
        let example = ['search'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "              +
                        " * "               +
                    " FROM "                +
                        " post "            +
                    " WHERE "               +
                        " (title like ? "   +
                        " OR "              +
                        " content like ? ) ";
        sql = dbFactory.build_mysql_format(sql,[
            '%' + req.body.data.search + '%',
            '%' + req.body.data.search + '%']);
        dbFactory.action_db(sql, statusData, res);
    },
    update_post:function (req, res) {
        let example = ['title','content','time', 'id'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        var sql =   " UPDATE "                  +
                        " `post` "           +
                    " SET "                     +
                        " `title` = ? , "        +
                        " `content` = ? , "       +
                        " `time` = ?  "       +
                    " WHERE "                   +
                        " `id` = ? ";

        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.title,
                req.body.data.content,
                req.body.data.time,
                req.body.data.id  ]);
        let statusData = {
            successCode: 202,
            errorCode: 500,
            errorMsg: "Some error occurred while inserting the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },
    insert_post:function (req, res) {
        let example = ['title','content','time'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        var sql =   " INSERT INTO"       +
                        " `post` "       +
                        " (`title`,"     +
                        " `content`,"    +
                        " `time`) "      +
                    " VALUES "           +
                        " (?,?,?) ";

        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.title,
                req.body.data.content,
                req.body.data.time ]);
        let statusData = {
            successCode: 202,
            errorCode: 500,
            errorMsg: "Some error occurred while inserting the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },
    delete_post: function(req, res) {
        let example = ['id'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!')
            return
        };

        var sql =   " DELETE "          +
                    " FROM "            +
                        " `post` "   +
                    " WHERE "           +
                        " `id` = ? ";

        sql = dbFactory.build_mysql_format(sql,[   req.body.data.id  ]);

        let statusData = {
            successCode: 203,
            errorCode: 500,
            errorMsg: "Some error occurred while inserting the account."
        };

        dbFactory.action_db(sql, statusData, res);
    }
}
