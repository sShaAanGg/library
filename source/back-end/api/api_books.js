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

    show_all_books: function(req, res){

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };

        var sql =   " SELECT "      +
                        " * "       +
                    " FROM "        +
                        " books ";


        // sql = dbFactory.build_mysql_format(sql,[req.body.data.account,sha256(req.body.data.password)]);

        dbFactory.action_db(sql, statusData, res);
    },
    show_collect_books: function(req, res){
        let example = ['account'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "            +
                        " collect_books "             +
                    " FROM "              +
                        " account "       +
                    " WHERE "             +
                        " account = ? ";
        sql = dbFactory.build_mysql_format(sql,[req.body.data.account]);
        dbFactory.action_db(sql, statusData, res);
    },
    show_borrow_books: function(req, res){
        let example = ['account'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "                       +
                        " * "                        +
                    " FROM "                         +
                        " books "                    +
                    "  JOIN  "                                 +
                        "borrow_list"                         +
                    " ON "                                     +
                        " (books.id = borrow_list.book_id "   +
                    " AND "                                    +
                        " borrow_list.return = 0 "             +
                    " AND "                                    +
                        " borrow_list.account = ?);";
        sql = dbFactory.build_mysql_format(sql,[req.body.data.account]);
        dbFactory.action_db(sql, statusData, res);
    },
    show_history_books: function(req, res){
        let example = ['account'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "                       +
                        " * "                        +
                    " FROM "                         +
                        " books "                    +
                    "  WHERE  "                      +
                        "id in "                     +
                            " (SELECT "              +
                                "book_id "           +
                            " FROM "                 +
                                " borrow_list "      +
                            " WHERE "                +
                                " (`account` = ? "   +
                            " AND "                  +
                                " `return` = 1 )) ";
        sql = dbFactory.build_mysql_format(sql,[req.body.data.account]);
        dbFactory.action_db(sql, statusData, res);
    },
    show_reserve_books: function(req, res){
        let example = ['account'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "                                 +
                        " * "                                  +
                    " FROM "                                   +
                        " books "                              +
                    "  JOIN  "                                 +
                        "reserve_list"                         +
                    " ON "                                     +
                        " (books.id = reserve_list.book_id "   +
                    " AND "                                    +
                        " reserve_list.account = ?);";
        sql = dbFactory.build_mysql_format(sql,[req.body.data.account]);
        dbFactory.action_db(sql, statusData, res);
    },
    add_to_collect: function(req, res){
        let example = ['account', 'collect'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        var sql =   " UPDATE "                    +
                        " `account` "             +
                    " SET "                       +
                        " `collect_books` = ? "  +
                    " WHERE "                     +
                        " `account` = ?";
        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.collect,
                req.body.data.account
            ]);
        // console.log(sql)
        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };
        dbFactory.action_db(sql, statusData, res);
    },
    borrow_books: function(req, res){
        let example = ['id', 'account', 'time_start', 'time_end'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };
        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };

        var sql =   " INSERT INTO "             +
                        " borrow_list "         +
                        " (`account`, "         +
                        " `book_id` ,"          +
                        " `time_start` ,"       +
                        " `time_end` )"         +
                    " VALUES "                  +
                        " (?,?,?,?); "          +

                    " UPDATE "                  +
                        " `books` "             +
                    " SET "                     +
                        " borrow = 1 "          +
                    " WHERE "                   +
                        " id = ?; ";
        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.account,
                req.body.data.id,
                req.body.data.time_start,
                req.body.data.time_end,
                req.body.data.id]);
        dbFactory.action_db(sql, statusData, res);
    },
    check_is_reserve: function(req, res){
        let example = ['id', 'account', 'number'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };
        var sql =   " SELECT "             +
                        " borrow_id "      +
                    " FROM "               +
                        " reserve_list "   +
                    " WHERE "              +
                        " (account = ? "   +
                        " AND "            +
                        "  book_id = ?);"

        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.account,
                req.body.data.id]);
        dbFactory.action_db(sql, statusData, res);
    },
    reserve_books: function(req, res){
        let example = ['id', 'account', 'number'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };
        var sql =   " INSERT INTO "         +
                        " reserve_list "    +
                        " (`account`, "     +
                        " `book_id` , "     +
                        " `number`) "       +
                    " VALUES "              +
                        " (?,?,?); "        +


                    " UPDATE "              +
                        " `books` "         +
                    " SET "                 +
                        " reserve = ? "     +
                    " WHERE "               +
                        " id = ?; "
        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.account,
                req.body.data.id,
                req.body.data.number + 1,
                req.body.data.number + 1,
                req.body.data.id]);
        dbFactory.action_db(sql, statusData, res);
    },
    cancel_reserve: function(req, res){
        let example = ['id', 'account', 'number'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };
        var sql =   " DELETE FROM "               +
                        " `reserve_list` "        +
                    " WHERE "                     +
                        "( `book_id` = ? "        +
                        " AND "                   +
                        " `account` = ? );"        +

                    " UPDATE "                    +
                        " `reserve_list` "        +
                    " SET "                       +
                        " number = number - 1 "   +
                    " WHERE "                     +
                        "( book_id = ? "          +
                        " AND "                   +
                        " number > ?) ;"          +

                    " UPDATE "                    +
                        " `books` "               +
                    " SET "                       +
                        " reserve = reserve - 1 " +
                    " WHERE "                     +
                        " id = ?; "
        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.id,
                req.body.data.account,
                req.body.data.id,
                req.body.data.number,
                req.body.data.id]);
        console.log(sql);
        dbFactory.action_db(sql, statusData, res);
    },
    return_books: function(req, res){
        let example = ['id', 'account'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        var sql =   " UPDATE "                        +
                        " `books` "                   +
                    " SET "                           +
                        " `borrow` = 0 "              +
                    " WHERE "                         +
                        " `id` = ?;"                  +

                    " UPDATE "                        +
                        " `borrow_list` "             +
                    " SET "                           +
                        " `return` = 1 "              +
                    " WHERE "                         +
                        "( `book_id` = ? "            +
                        " AND "                       +
                        " `account` = ? );";
        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.id,
                req.body.data.id,
                req.body.data.account]);
        console.log(sql)
        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };
        dbFactory.action_db(sql, statusData, res);
    },
    reserve_to_borrow: function(req, res){
        let example = ['id', 'account', 'time_start', 'time_end'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        var sql =   " UPDATE "                        +
                        " `books` "                   +
                    " SET "                           +
                        "`reserve` = `reserve` - 1, " +
                        " `borrow` = 1"               +
                    " WHERE "                         +
                        " `id` = ?;"                  +

                    " UPDATE "                        +
                        " `reserve_list` "            +
                    " SET "                           +
                        " `number` = number - 1 "     +
                    " WHERE "                         +
                        " `book_id` = ?;"             +

                    " INSERT INTO "                   +
                        " borrow_list "               +
                        " ( `account`, "              +
                        " `book_id`, "                +
                        " `time_start` ,"             +
                        " `time_end` )"               +
                    " VALUES "                        +
                        " ( (SELECT `account` FROM `reserve_list` WHERE `book_id` = ? AND `number` = 0 ), ?,?,?) ;"  +

                    " DELETE FROM "                   +
                        " `reserve_list` "            +
                    " WHERE "                         +
                        "( `book_id` = ? "            +
                        " AND "                       +
                        " `number` = 0 );";
        sql = dbFactory.build_mysql_format(sql,
            [   req.body.data.id,
                req.body.data.id,
                req.body.data.id,
                req.body.data.id,
                req.body.data.time_start,
                req.body.data.time_end,
                req.body.data.id]);
        console.log('77' + sql);
        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while add to collect the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },
    search_all: function(req, res){
        let example = ['search']

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "               +
                        " * "                +
                    " FROM "                 +
                        " books "            +
                    " WHERE "                +
                        " (`name` like ?"    +
                        " OR "               +
                        " `author` like ? "  +
                        " OR "               +
                        " `publish` like ? )";
        sql = dbFactory.build_mysql_format(sql,
            [   '%' + req.body.data.search + '%',
                '%' + req.body.data.search + '%',
                '%' + req.body.data.search + '%' ]);
        dbFactory.action_db(sql, statusData, res);
    },
    search_by_name: function(req, res){
        let example = ['name']

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "         +
                        " * "          +
                    " FROM "           +
                        " books "      +
                    " WHERE "          +
                        " `name` like ?";
        sql = dbFactory.build_mysql_format(sql,[ '%' + req.body.data.name + '%' ]);
        dbFactory.action_db(sql, statusData, res);
    },
    search_by_author: function(req, res){
        let example = ['author']

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "         +
                        " * "          +
                    " FROM "           +
                        " books "      +
                    " WHERE "          +
                        " `author` like ?";
        sql = dbFactory.build_mysql_format(sql,[ '%' + req.body.data.author + '%' ]);
        dbFactory.action_db(sql, statusData, res);
    },
    search_by_publish: function(req, res){
        let example = ['publish']

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " SELECT "         +
                        " * "          +
                    " FROM "           +
                        " books "      +
                    " WHERE "          +
                        " `publish` like ?";
        sql = dbFactory.build_mysql_format(sql,[ '%' + req.body.data.publish + '%' ]);
        dbFactory.action_db(sql, statusData, res);
    },
    delete_book: function(req, res){
        let example = ['id'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 203,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " DELETE "         +
                    " FROM "           +
                        " books "      +
                    " WHERE "          +
                        " `id` = ?";
        sql = dbFactory.build_mysql_format(sql,[ req.body.data.id ]);
        dbFactory.action_db(sql, statusData, res);
    },
    insert_book: function(req, res){
        // const multer = require('multer');
        // const upload = multer({ dest: 'public/img/tmp_uploads/' }); // 設定上傳暫存目錄
        // const fs = require('fs'); // 處理檔案的核心套件
        // app.get('/try-upload', (req, res) => {
        //     res.render('try-upload');
        // });
        // app.post('/try-upload', upload.single('avatar'), (req, res) => {
        //     console.log(req.file); // 查看裡面的屬性
        //     if (req.file && req.file.originalname) {
        //         // 判斷是否為圖檔
        //         if (/\.(jpg|jpeg|png|gif)$/i.test(req.file.originalname)) {
        //             // 將檔案搬至公開的資料夾
        //             fs.rename(req.file.path, './public/img/' + req.file.originalname, error => { });
        //         } else {
        //             fs.unlink(req.file.path, error => { }); // 刪除暫存檔
        //         }
        //     }
        //     res.render('try-upload', {
        //         result: true,
        //         name: req.body.name,
        //         avatar: '/img/' + req.file.originalname
        //     });
        // });
        let example = ['name', 'author', 'publish', 'callnumber'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " INSERT INTO "         +
                        " books "           +
                        " ( `name`, "       +
                        " `author`, "       +
                        " `publish`, "      +
                        " `callnumber` ) "  +
                    " VALUES "              +
                        " ( ?, ?, ?, ?) ;";

        sql = dbFactory.build_mysql_format(sql,[
                req.body.data.name,
                req.body.data.author,
                req.body.data.publish,
                req.body.data.callnumber ]);
        dbFactory.action_db(sql, statusData, res);
    },
    update_book: function(req, res){
        let example = ['name', 'author', 'publish', 'callnumber', 'id'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return;
        };

        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        var sql =   " UPDATE "                        +
                        " `books` "                   +
                    " SET "                           +
                        " `name` = ?, "               +
                        " `author` = ?, "             +
                        " `publish` = ?, "            +
                        " `callnumber` = ? "          +
                    " WHERE "                         +
                        " `id` = ?;";

        sql = dbFactory.build_mysql_format(sql,[
                req.body.data.name,
                req.body.data.author,
                req.body.data.publish,
                req.body.data.callnumber,
                req.body.data.id ]);
        dbFactory.action_db(sql, statusData, res);
    },
    // upload_img: function(req, res){

    // },
}
