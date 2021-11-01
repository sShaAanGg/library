const path = require('path');
var db = require('../utility/DbFactory');
var utility = require('../utility/utils');
const net = require("net");
const { time } = require('console');
const axios = require('axios');

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
};

const axiosConfig = {
    headers: {
        "License-Key": '2ebed68cc4c1d3ad38d3ca348b468f93cf3833a1a9cb7d29adb1a277fde79b72'
    }
};

let readGpioData = {
    "port": "",
    "pin": 0,
    "deviceCount": 0,
    "devices": []
};

Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
    const val = item[prop]
    groups[val] = groups[val] || []
    groups[val].push(item)
    return groups
    }, {})
};

module.exports = {

    /*========================================================== */
    //  enms api
    //      Dashboard
    //      Analysis
    //      ProductionLineAnalysis
    //      ElectricBill
    //      DemandPredict
    //      MachineManage
    //      AbnormalAlert
    //      Unused
    /*========================================================== */

    /* Dashboard API */
    select_current_month_cumulative_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select_current_cumulative_electricity_consumption"
        };
        let sql =   " SELECT "                                                                              +
                        " machine_info.factory, "                                                           +
                        " SUM(electricity) AS elec "                                                        +
                    " FROM "                                                                                +
                        " ((history_day_info "                                                              +
                            " INNER JOIN "                                                                  +
                                " equipment_info ON history_day_info.mac = equipment_info.mac) "            +
                            " INNER JOIN "                                                                  +
                                " machine_info on equipment_info.machine_sn = machine_info.machine_sn) "    +
                    " WHERE "                                                                               +
                        " history_day_info.`datetime` < ? "                                  +
                    " AND "                                                                                 +
                        " history_day_info.`datetime` > ? "                                  +
                    " GROUP BY "                                                                            +
                        " machine_info.factory";
        sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date().setMonth(new Date().getMonth()), 'yyyyMMddHHmmss'),
                        utility.formattime(new Date().setMonth(new Date().getMonth()), 'yyyyMMdd000000')]);
        dbFactory.action_db_with_cb(sql, statusData, (resPreDays) => {
            let secondSql =     " SELECT "                                                                      +
                                    " machine_info.factory, "                                                   +
                                    " equipment_info.machine_sn, "                                              +
                                    " machine_info.voltage, "                                                   +
                                    " SUM(ampere) AS 'sum_ampere' "                                             +
                                " FROM "                                                                        +
                                    " ((enms_info "                                                             +
                                " INNER JOIN "                                                                  +
                                    " equipment_info on enms_info.mac = equipment_info.mac) "                   +
                                " INNER JOIN "                                                                  +
                                    " machine_info on equipment_info.machine_sn = machine_info.machine_sn) "    +
                                " WHERE "                                                                       +
                                    " enms_info.`datetime` < ? AND enms_info.`datetime` > ? "                   +
                                " GROUP BY "                                                                    +
                                    " machine_info.machine_sn ";
            secondSql = dbFactory.build_mysql_format(secondSql, [utility.formattime(new Date().setMonth(new Date().getMonth()), 'yyyyMMddHHmmss'),
                                                                utility.formattime(new Date().setMonth(new Date().getMonth()), 'yyyyMMdd000000')]);
            dbFactory.action_db_with_cb(secondSql, statusData, (resToday) => {
                let cumulativeElectricityConsumption = [];
                let sumArray = [];
                let factoryEle = 0;
                let ix = 0, iy = 0;
                let groupByFactory = resToday.groupBy('factory');

                while(ix < Object.keys(groupByFactory).length){
                    sumArray = [];
                    sumArray = groupByFactory[Object.keys(groupByFactory)[ix]];
                    iy = 0;

                    for (let iy = 0; iy < resPreDays.length; ++iy) {
                        if(resPreDays[iy]['factory'] === Object.keys(groupByFactory)[ix]) {
                            factoryEle = resPreDays[iy]['elec'];
                            break;
                        }
                    }
                    if(factoryEle === 0) {
                        console.log('No previous daily elec for', Object.keys(groupByFactory)[ix]);
                    }
                    while(iy < sumArray.length){
                        factoryEle += (sumArray[iy].voltage * sumArray[iy].sum_ampere)/360000;
                        ++ iy;
                    }
                    cumulativeElectricityConsumption.push(factoryEle.toFixed(2));
                    ++ ix;
                }
                res.status(statusData.successCode).send(cumulativeElectricityConsumption);
            });

        });
    },

    select_two_years_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_two_years_electricity_consumption "
        };

        let sql =   " SELECT "                                                              +
                        " SUM(history_month_info.electricity) as electricity, "             +
                        " history_month_info.`datetime`, "                                  +
                        " history_month_info.watt, "                                        +
                        " SUM(history_month_info.carbon_footprint) as carbon_footprint, "   +
                        " history_month_info.carbon_negative "                              +
                    " FROM "                                                                +
                        " history_month_info "                                              +
                    " WHERE "                                                               +
                        "`datetime` > ? AND `datetime` < ? "                                +
                    " GROUP BY "                                                            +
                        " `datetime` ";
        sql = dbFactory.build_mysql_format(sql, [   new Date().getFullYear()-1 + '01000000',
                                                    utility.formattime(new Date(), 'yyyy1200000000')]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_two_years_elec: function(req, res) {
        /* select passed two years electricity consumption
        @purpose
            if current date is in 2021 August, it will select data between 2020-01 ~ 2021-08
        @argument:
            none, get system time to format sql
        @return:
            an array which length between 0-24
        */
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_two_years_electricity_consumption "
        };

        let sql =   " SELECT "                                                              +
                        " SUM(history_month_info.electricity) as elec "                     +
                    " FROM "                                                                +
                        " history_month_info "                                              +
                    " WHERE "                                                               +
                        "`datetime` > ? AND `datetime` < ? "                                +
                    " GROUP BY "                                                            +
                        " `datetime` ";
        sql = dbFactory.build_mysql_format(sql, [   new Date().getFullYear()-1 + '01000000',
                                                    utility.formattime(new Date(), 'yyyy1200000000')]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_two_years_carbon_footprint: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_two_years_electricity_consumption "
        };

        let sql =   " SELECT "                                                              +
                        " SUM(history_month_info.carbon_footprint) as carbon_footprint "   +                             +
                    " FROM "                                                                +
                        " history_month_info "                                              +
                    " WHERE "                                                               +
                        "`datetime` > ? AND `datetime` < ? "                                +
                    " GROUP BY "                                                            +
                        " `datetime` ";
        sql = dbFactory.build_mysql_format(sql, [   new Date().getFullYear()-1 + '01000000',
                                                    utility.formattime(new Date(), 'yyyy1200000000')]);
        console.log(sql);
        dbFactory.action_db(sql, statusData, res);
    },

    select_real_time_electricity_consumption: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_real_time_electricity_consumption"
        };

        let time = new Date().setMonth(new Date().getMonth());

        let sql =   " SELECT "                                                                          +
                        " real_time_total.mac, "                                                        +
                        " real_time_total.`datetime`, "                                                 +
                        " real_time_total.ampere, "                                                     +
                        " real_time_total.machine_sn, "                                                 +
                        " machine_info.voltage "                                                        +
                    " FROM "                                                                            +
                        " machine_info, "                                                               +
                        " (SELECT "                                                                     +
                            " real_time_info.mac, "                                                     +
                            " real_time_info.`datetime`, "                                              +
                            " real_time_info.ampere, "                                                  +
                            " equipment_info.machine_sn "                                               +
                        " FROM "                                                                        +
                            " equipment_info, "                                                         +
                            " (SELECT * "                                                               +
                            " FROM "                                                                    +
                                " (Select "                                                             +
                                    " id, "                                                             +
                                    " mac, "                                                            +
                                    " `datetime`, "                                                     +
                                    " ampere, "                                                         +
                                    " ROW_NUMBER() Over "                                               +
                                    " (Partition By mac Order By `datetime` Desc) As Sort "             +
                                " FROM "                                                                +
                                    " enms_info "                                                       +
                                " WHERE "                                                               +
                                    " `datetime` < ? AND `datetime` > ? AND ampere != 0) enms_info "    +
                            " WHERE "                                                                   +
                                " Sort = 1) real_time_info "                                            +
                        " WHERE "                                                                       +
                            " equipment_info.mac = real_time_info.mac) real_time_total "                +
                    " WHERE "                                                                           +
                        " machine_info.machine_sn = real_time_total.machine_sn ";
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

    select_event_log: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_event_log"
        }
        let sql =   " SELECT "                                                                              +
                        " error_log.mac, "                                                                  +
                        " error_log.`start_datetime`, "                                                     +
                        " error_log.`event`, "                                                              +
                        " machine_info.factory "                                                            +
                    " FROM "                                                                                +
                        " error_log "                                                                       +
                    " JOIN "                                                                                +
                        " equipment_info ON equipment_info.mac = error_log.mac "                            +
                    " JOIN "                                                                                +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn "             +
                    "WHERE "                                                                                +
                        " `start_datetime` > ? AND `start_datetime` < ? ORDER BY `start_datetime` DESC ";
        let time = new Date().setTime(new Date() - 2000);
        sql = dbFactory.build_mysql_format(sql, [utility.formattime(new Date(time), 'yyyyMMddHHmmss'), utility.formattime(new Date(), 'yyyyMMddHHmmss')]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_every_years_average: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_every_years_average"
        };
        let sql =   " SELECT "+
                    " mac, datetime, SUBSTR(datetime, 5,2) AS `month`, electricity, watt, sum(carbon_footprint) as carbon_footprint, carbon_negative " +
                    " FROM history_month_info" +
                    " GROUP BY datetime";
        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            let ix = 0, iy = 0;
            let eleAverage = new Array(12);
            let average = [];
            let totalEle = 0;
            let groupByMonth = result.groupBy('month');
            while(ix < Object.keys(groupByMonth).length) {
                average = [];
                average = groupByMonth[Object.keys(groupByMonth)[ix]];
                iy = 0;
                totalEle = 0;
                while(iy < average.length){
                    totalEle += average[iy].carbon_footprint;
                    ++ iy;

                }
                totalEle = totalEle / iy;

                eleAverage[Object.keys(groupByMonth)[ix] - 1] = totalEle.toFixed(2);
                // eleAverage.push([{'month':Object.keys(groupByMonth)[ix], 'electricity':totalEle.toFixed(2)}]);
                ++ ix;
            }
            res.status(statusData.successCode).send(eleAverage);
        });
    },

    select_equip_controllers: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_equip_buttons";
        let sql =   " SELECT "                                                                  +
                        " DISTINCT equipment_controller.mac, "                                  +
                        " equipment_controller.button_name, "                                   +
                        " equipment_controller.button_type, "                                   +
                        " equipment_controller.button_port, "                                   +
                        " equipment_controller.button_pin, "                                    +
                        " equipment_controller.button_status "                                  +
                    " FROM "                                                                    +
                        " equipment_controller "                                                +
                    " JOIN "                                                                    +
                        " equipment_info ON equipment_controller.mac = equipment_info.mac "     +
                    " JOIN "                                                                    +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn " +
                    " WHERE "                                                                   +
                        " machine_info.factory = ?";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.factory]);
        dbFactory.action_db(sql, statusDataCommon, res);
    },

    select_envirnmental: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_envirmental";

        let sql =   " SELECT "                  +
                        " * "                   +
                    " FROM "                    +
                        " enms_environment "    +
                    " ORDER BY "                +
                        " `time` "              +
                    " DESC "                    +
                    " LIMIT 1 ";

        dbFactory.action_db(sql, statusDataCommon, res);
    },

    update_btn_swicth: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while update_btn_seicth";

        var sql =   " UPDATE "                      +
                        " equipment_controller "    +
                    " SET "                         +
                        " button_status = ? "       +
                    " WHERE mac = ? ";
        sql = dbFactory.build_mysql_format( sql, [ req.body.data.btnStatus,
                                            req.body.data.btnMac]);
        let setGpioData = {
            "port":req.body.data.btnPort,
            "pin":parseInt(req.body.data.btnPin),
            "control":req.body.data.btnStatus,
            "deviceCount":1,
            "devices":[{"mac":req.body.data.btnMac}]
        };
        console.log(setGpioData);
        axios
            .post(process.env.RESTFUL_IP + 'setgpio', setGpioData, axiosConfig)
            .then( (setgpioRes) => {
                if (setgpioRes.data.comms[0].status != 'OK')
                    res.status(statusDataCommon.errorCode).send("setGpioStatus failed!");

                axios
                    .post(process.env.RESTFUL_IP + 'readgpio', setGpioData, axiosConfig)
                    .then((readgpioRes) => {
                        if ((setGpioData.control == 1 ? 'ON' : 'OFF') != readgpioRes.data.comms[0].gpioStatus){
                            res.status(statusDataCommon.errorCode).send("gpioStatus is not true!");
                        }

                        dbFactory.action_db(sql, statusDataCommon, res);
                    })
                    .catch((error) => console.log(error));
            })
            .catch( (error) => console.log(error));
    },

    /* End of Dashboard API */

    /* Analysis API */
    select_data_year: function(req, res){
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_data_year"
        }

        let sql =   " SELECT "                                  +
                        " DATE_FORMAT(datetime,'%Y') as year "  +
                    " FROM "                                    +
                        " history_month_info "                  +
                    " GROUP BY "                                +
                        " year ";

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
                sql =   " SELECT "                                                                      +
                            " DATE_FORMAT(history_month_info.datetime,'%Y-%m') as datetime, "           +
                            " history_month_info.electricity, "                                         +
                            " history_month_info.carbon_footprint, "                                    +
                            " history_month_info.carbon_negative, "                                     +
                            " machine_info.machine_name, "                                              +
                            " machine_info.factory, "                                                   +
                            " machine_info.type "                                                       +
                        " FROM "                                                                        +
                            " ((history_month_info "                                                    +
                        " INNER JOIN "                                                                  +
                            " equipment_info ON history_month_info.mac = equipment_info.mac) "          +
                        " INNER JOIN "                                                                  +
                            " machine_info ON equipment_info.machine_sn = machine_info.machine_sn) "    +
                        " WHERE "                                                                       +
                            " history_month_info.datetime >= ? "                                        +
                        " AND "                                                                         +
                            " history_month_info.datetime < ? "                                         +
                        " AND "                                                                         +
                            " machine_info.factory = ? ";
                sql = dbFactory.build_mysql_format(sql, [   new Date(param.date).getFullYear()-1  + '0100000000',
                                                            new Date(param.date).getFullYear()+1 + '0100000000',
                                                            param.factory]);
            } else {
                sql =   " SELECT "                                                                      +
                            " DATE_FORMAT(history_month_info.datetime,'%Y-%m') as datetime, "           +
                            " history_month_info.electricity, "                                         +
                            " history_month_info.carbon_footprint, "                                    +
                            " history_month_info.carbon_negative, "                                     +
                            " machine_info.machine_name, "                                              +
                            " machine_info.factory, "                                                   +
                            " machine_info.type "                                                       +
                        " FROM "                                                                        +
                            " ((history_month_info "                                                    +
                        " INNER JOIN "                                                                  +
                            " equipment_info ON history_month_info.mac = equipment_info.mac) "          +
                        " INNER JOIN "                                                                  +
                            " machine_info ON equipment_info.machine_sn = machine_info.machine_sn) "    +
                        " WHERE "                                                                       +
                            " history_month_info.datetime >= ? "                                        +
                        " AND "                                                                         +
                            " history_month_info.datetime < ? ";
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
                sql  =  " SELECT "                                                                      +
                            " DATE_FORMAT(history_day_info.datetime,'%Y-%m-%d') as datetime, "          +
                            " history_day_info.electricity, "                                           +
                            " history_day_info.carbon_footprint, "                                      +
                            " history_day_info.carbon_negative, "                                       +
                            " machine_info.machine_name, "                                              +
                            " machine_info.factory,+ "                                                  +
                            " machine_info.type "                                                       +
                        " FROM "                                                                        +
                            " ((history_day_info "                                                      +
                        " INNER JOIN "                                                                  +
                            " equipment_info ON history_day_info.mac = equipment_info.mac) "            +
                        " INNER JOIN "                                                                  +
                            " machine_info ON equipment_info.machine_sn = machine_info.machine_sn) "    +
                        " WHERE "                                                                       +
                            " history_day_info.datetime >= ? "                                          +
                        " AND "                                                                         +
                            " history_day_info.datetime < ? "                                           +
                        " AND "                                                                         +
                            " machine_info.factory = ? ";
                sql = dbFactory.build_mysql_format(sql, [   date1,
                                                            date2,
                                                            param.factory]);
            } else {
                sql =   " SELECT "                                                                      +
                            " DATE_FORMAT(history_day_info.datetime,'%Y-%m-%d') as datetime, "          +
                            " history_day_info.electricity, "                                           +
                            " history_day_info.carbon_footprint, "                                      +
                            " history_day_info.carbon_negative, "                                       +
                            " machine_info.machine_name, "                                              +
                            " machine_info.factory, "                                                   +
                            " machine_info.type "                                                       +
                        " FROM "                                                                        +
                            " ((history_day_info "                                                      +
                        " INNER JOIN "                                                                  +
                            " equipment_info ON history_day_info.mac = equipment_info.mac) "            +
                        " INNER JOIN "                                                                  +
                            " machine_info ON equipment_info.machine_sn = machine_info.machine_sn) "    +
                        " WHERE "                                                                       +
                            " history_day_info.datetime >= ? AND history_day_info.datetime < ? ";
                sql = dbFactory.build_mysql_format(sql, [   date1,
                                                            date2]);
            }
        }

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            res.status(statusData.successCode).send(result);
        });
    },

    /* End of Analysis API */

    /* ProductionLineAnalysis API */
    select_factory_machine_monthly_info: function(req, res) {
        /* TODO
            change factory to production_line
            because factory is for demo
        */
        statusDataCommon['errorMsg'] = "Some error occurred while select_factory_machine_monthly_info";

        var sql = '';
        if(req.body.data.factory.length == 0 || req.body.data.datetime.length == 0) {
            sql =   " SELECT DISTINCT "                                                                     +
                        " machine_info.factory, "                                                           +
                        " machine_info.machine_name, "                                                      +
                        " machine_info.machine_sn, "                                                        +
                        " machine_info.month_elec AS cur_month_elec, "                                      +
                        " (machine_info.month_elec - history_month_info.electricity) AS yoy_month_elec, "   +
                        " machine_info.activation "                                                         +
                    " FROM "                                                                                +
                        " equipment_info "                                                                  +
                    " JOIN "                                                                                +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn "             +
                    " JOIN "                                                                                +
                        " history_month_info ON equipment_info.mac = history_month_info.mac "               +
                    " WHERE "                                                                               +
                        " history_month_info.`datetime` = 20210901000000";
            let curDate = new Date().getFullYear() + new Date().getMonth() + "01000000";
            // sql = dbFactory.build_mysql_format(sql, curDate);
            sql = dbFactory.build_mysql_format(sql);
        }
        else {
            sql =   " SELECT DISTINCT "                                                                     +
                        " machine_info.factory, "                                                           +
                        " machine_info.machine_name, "                                                      +
                        " machine_info.machine_sn, "                                                        +
                        " machine_info.month_elec AS cur_month_elec, "                                      +
                        " (machine_info.month_elec - history_month_info.electricity) AS yoy_month_elec, "   +
                        " machine_info.activation "                                                         +
                    " FROM "                                                                                +
                        " equipment_info "                                                                  +
                    " JOIN "                                                                                +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn "             +
                    " JOIN "                                                                                +
                        " history_month_info ON equipment_info.mac = history_month_info.mac "               +
                    " WHERE "                                                                               +
                        " machine_info.factory = ? AND history_month_info.`datetime` = ?";
            sql = dbFactory.build_mysql_format(sql, [req.body.data.factory, req.body.data.datetime]);
        }
        dbFactory.action_db(sql, statusDataCommon, res);

    },

    select_equip_error_log: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_equip_error_log";

        let sql =   " SELECT "                                                                  +
                        " DISTINCT error_log.`event`, "                                         +
                        " DATE_FORMAT(error_log.start_datetime,'%Y-%m-%d %H:%i:%s') as start_datetime, "                                           +
                        " DATE_FORMAT(error_log.end_datetime,'%Y-%m-%d %H:%i:%s') as end_datetime "                                              +
                    " FROM "                                                                    +
                        " error_log "                                                           +
                    " JOIN "                                                                    +
                        " equipment_info ON error_log.mac = equipment_info.mac "                +
                    " JOIN "                                                                    +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn " +
                    " WHERE "                                                                   +
                        " machine_info.machine_sn = ? ";

        sql = dbFactory.build_mysql_format(sql, [req.body.data.machine_sn]);
        dbFactory.action_db(sql, statusDataCommon, res);
    },

    select_equip_daily_elec_yoy: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_equip_daily_elec_yoy";

        let sql =   " SELECT "                                                                  +
                        " history_day_info.electricity "                                        +
                    " FROM "                                                                    +
                        " history_day_info "                                                    +
                    " JOIN "                                                                    +
                        " equipment_info ON history_day_info.mac = equipment_info.mac "         +
                    " JOIN "                                                                    +
                        " machine_info ON machine_info.machine_sn = equipment_info.machine_sn " +
                    " WHERE "                                                                   +
                        " machine_info.machine_sn = ? "                                         +
                    " AND "                                                                     +
                        " history_day_info.`datetime` >= ? "                                    +
                    " AND "                                                                     +
                        " history_day_info.`datetime` <= ? "                                    +
                    " ORDER BY "                                                                +
                        " history_day_info.`datetime` ";
        sql = dbFactory.build_mysql_format(sql,
                        [req.body.data.machine_sn, req.body.data.start_date, req.body.data.end_date]);
        dbFactory.action_db(sql, statusDataCommon, res);
    },

    select_equip_daily_elec_this_month: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_equip_daily_elec_this_month";

        let sql =   " SELECT "                                                                  +
                        " history_day_info.electricity "                                        +
                    " FROM "                                                                    +
                        " history_day_info "                                                    +
                    " JOIN "                                                                    +
                        " equipment_info ON history_day_info.mac = equipment_info.mac "         +
                    " JOIN "                                                                    +
                        " machine_info ON machine_info.machine_sn = equipment_info.machine_sn " +
                    " WHERE "                                                                   +
                        " machine_info.machine_sn = ?  "                                        +
                    " AND "                                                                     +
                        " history_day_info.`datetime` >= ? "                                    +
                    " AND "                                                                     +
                        " history_day_info.`datetime` <= ? "                                    +
                    " ORDER BY "                                                                +
                        " history_day_info.`datetime` ";
        sql = dbFactory.build_mysql_format(sql,
                        [req.body.data.machine_sn, req.body.data.start_date, req.body.data.end_date]);
        dbFactory.action_db(sql, statusDataCommon, res);
    },

    /* End of ProductionLineAnalysis API */

    /* ElectricBill API */
    select_options: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_options"
        };
        let sql = " SELECT `datetime` from history_month_info GROUP BY `datetime` ";
        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            let yearList = [];
            for(let ix = 0; ix < result.length; ++ix) {
                let itemYear = result[ix].datetime.toString().substring(0, 4);
                let foundIdx = yearList.findIndex(x => x === itemYear);
                if (foundIdx < 0) {
                    yearList.push(itemYear);
                }
            }
            res.status(statusData.successCode).send([yearList]);
        });
    },
    select_factory_info_for_elec_bill: function(req, res) {
        /* select specific month

        */
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_factory_info_for_elec_bill"
        };
        let sql =   " SELECT "                                                                      +
                        " machine_info.factory, "                                                   +
                        " SUM(history_month_info.demand) AS demand, "                               +
                        " SUM(history_month_info.electricity) AS elec "                             +
                    " FROM "                                                                        +
                        " history_month_info "                                                      +
                    " JOIN "                                                                        +
                        " equipment_info ON history_month_info.mac = equipment_info.mac "           +
                    " JOIN "                                                                        +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn "     +
                    " WHERE "                                                                       +
                        " `datetime` = ? "                                                          +
                    " GROUP BY "                                                                    +
                        "machine_info.factory ";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.datetime]);
        console.log(sql);
        dbFactory.action_db(sql, statusData, res);
    },
    select_machine_info_for_elec_bill: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_machine_info_for_elec_bill"
        };
        let sql =   " SELECT "                                                                      +
                        " machine_info.machine_name, "                                              +
                        " machine_info.factory, "                                                   +
                        " SUM(history_month_info.demand) AS demand, "                               +
                        " SUM(history_month_info.electricity) AS elec "                             +
                    " FROM "                                                                        +
                        " history_month_info "                                                      +
                    " JOIN "                                                                        +
                        " equipment_info ON history_month_info.mac = equipment_info.mac "           +
                    " JOIN "                                                                        +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn "     +
                    " WHERE "                                                                       +
                        " `datetime` = ? "                                                          +
                    " GROUP BY "                                                                    +
                        "history_month_info.mac ";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.datetime]);
        dbFactory.action_db(sql, statusData, res);
    },
    /* End of ElectricBill API */

    /* DemandPredict API */
    select_predict_capacity: function(req, res) {
        /* select passed two years electricity consumption
        @purpose
            if current date is in 2021 August, it will select data between 2020-01 ~ 2021-08
        @argument:
            none, get system time to format sql
        @return:
            an array which length between 0-24
        */
        statusDataCommon['errorMsg'] = " Some error occurred while select_predict_capacity ";

        let sql =   " SELECT "                                                                      +
                        " history_month_info.electricity AS elec "                                  +
                    " FROM "                                                                        +
                        "history_month_info "                                                       +
                    " JOIN "                                                                        +
                        " equipment_info ON equipment_info.mac = history_month_info.mac "           +
                    " JOIN "                                                                        +
                        " machine_info ON machine_info.machine_sn = equipment_info.machine_sn "     +
                    " WHERE "                                                                       +
                        " machine_info.machine_sn = ? "                                             +
                    " AND "                                                                         +
                        " `datetime` > ? "                                           +
                    " AND "                                                                         +
                        " `datetime` < ? ";
        let lastYear = new Date().getFullYear() - 1;
        let curMonth = new Date().getMonth() + 1;
        let next3MonthYear = lastYear;
        let next3Month = (curMonth + 4) % 12;
        (Math.floor((curMonth + 3) / 12) >= 1) ? next3MonthYear = lastYear + 1 : next3MonthYear = lastYear;
        (curMonth < 10) ? curMonth = '0' + curMonth.toString() : curMonth = curMonth.toString();
        (next3Month < 10) ? next3Month = '0' + next3Month.toString() : next3Month = next3Month.toString();
        let startDate = lastYear.toString() + curMonth + '01000000';
        let endDate = next3MonthYear.toString() + next3Month + '00000000';

        sql = dbFactory.build_mysql_format(sql, [req.body.data.machine_sn, startDate, endDate]);

        dbFactory.action_db_with_cb(sql, statusDataCommon, (result) => {
            let predictCapicity = 0;
            for (let ix = 0; ix < result.length; ++ix){
                predictCapicity += result[ix].elec;
            }
            predictCapicity = parseFloat(predictCapicity.toFixed(2));
            res.status(statusDataCommon.successCode).send([predictCapicity]);
        });
        // dbFactory.action_db(sql, statusData, res);
    },

    select_current_capacity: function(req, res) {
        /* select electricity consumption of current month
        @purpose
            if current date is in 2021 August, it will select data between 2020-01 ~ 2021-08
        @argument:
            none, get system time to format sql
        @return:
            an array which length between 0-24
        */
        statusDataCommon['errorMsg'] = " Some error occurred while select_current_capacity ";


        let sql =   " SELECT "                                  +
                        " machine_info.month_elec AS elec "     +
                    " FROM "                                                                        +
                        " machine_info "                                                       +
                    " WHERE "                                                                       +
                        " machine_info.machine_sn = ? ";

        sql = dbFactory.build_mysql_format(sql, [req.body.data.machine_sn]);
        dbFactory.action_db(sql, statusDataCommon, res);
    },

    select_machine_info_for_demand_predict: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_machine_info_for_demand_predict";

        let sql = "";
        let commonSql = " SELECT DISTINCT "                                                                     +
                            " machine_info.machine_name, "                                                      +
                            " machine_info.machine_sn, "                                                        +
                            " machine_info.factory, "                                                           +
                            " machine_info.type, "                                                              +
                            " machine_info.month_elec AS cur_month_elec "                                       +
                        " FROM "                                                                                +
                            " equipment_info "                                                                  +
                        " JOIN "                                                                                +
                            " machine_info ON equipment_info.machine_sn = machine_info.machine_sn ";

        if(req.body.data.factory === '全廠區' && req.body.data.type === '全部項目') {
            sql = dbFactory.build_mysql_format(commonSql);
        }
        else if (req.body.data.factory != '全廠區' && req.body.data.type === '全部項目') {
            sql =   commonSql                                                               +
                    " WHERE "                                                               +
                        " machine_info.factory = ? ";
            sql = dbFactory.build_mysql_format(sql, [req.body.data.factory]);
        }
        else if (req.body.data.factory === '全廠區' && req.body.data.type != '全部項目') {
            sql =   commonSql                                                               +
                    " WHERE "                                                               +
                        " machine_info.`type` = ? ";
            sql = dbFactory.build_mysql_format(sql, [req.body.data.type]);
        }
        else {
            // given factory and type
            sql =   commonSql                                                               +
                    " WHERE "                                                               +
                        " machine_info.factory = ? AND machine_info.type = ?";
            sql = dbFactory.build_mysql_format(sql, [req.body.data.factory, req.body.data.type]);
        }
        dbFactory.action_db(sql, statusDataCommon, res);
    },

    /* End of DemandPredict API */

    /* MachineManage API */
    select_machine_manage: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_machine_manage"
        };

        // if (req.body.data.searchFactory.length !== 0){
        //     let sql =   " SELECT "              +
        //                     " * "               +
        //                 " FROM "                +
        //                     " machine_info "    +
        //                 " WHERE "               +
        //                     " factory = ? ";
        //     sql = dbFactory.build_mysql_format(sql, [req.body.data.searchFactory]);
        //     dbFactory.action_db(sql, statusData, res);
        // } else {
        //     let sql =   " SELECT "  +
        //                     " * "   +
        //                 " FROM "    +
        //                     " machine_info ";
        //     dbFactory.action_db(sql, statusData, res);
        // }
        let sql = "SELECT * FROM machine_info";
        if (req.body.data.searchFactory.length !== 0){
            sql = " SELECT * FROM machine_info WHERE factory = ?";
            sql = dbFactory.build_mysql_format(sql, [req.body.data.searchFactory]);
        }

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            for(let ix = 0; ix < result.length; ++ix) {
                let dateStr = result[ix].establish_date.toString();
                let formatDate = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2);
                result[ix].establish_date = formatDate;
            }
            res.status(statusData.successCode).send(result);
        });
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

            let sql =   " INSERT INTO "         +
                            " machine_info "    +
                            " (machine_name, "  +
                            " machine_sn, "     +
                            " `type`, "         +
                            " factory, "        +
                            " establish_date, " +
                            " update_date, "    +
                            " year_elec, "      +
                            " month_elec,"      +
                            " voltage, "        +
                            " work_years, "     +
                            " work_hours, "     +
                            " activation) "     +
                        " VALUES "              +
                            " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
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

            let sql =   " UPDATE "                  +
                            " machine_info "        +
                        " SET "                     +
                            " machine_name = ?, "   +
                            " machine_sn = ?, "     +
                            " `type` = ?, "         +
                            " factory = ?, "        +
                            " voltage = ?, "        +
                            " work_years = ? "      +
                        " WHERE "                   +
                            " id = ?";
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

        let sql =   " DELETE "              +
                    " FROM "                +
                        " machine_info "    +
                    " WHERE id = ? ";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.id]);
        dbFactory.action_db(sql, statusData, res);
    },

    select_machine_sn: function(req, res) {
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while insert_machine_manage"
        };

        let sql =   " SELECT "              +
                        " * "               +
                    " FROM "                +
                        " machine_info "    +
                    " WHERE "               +
                        " machine_sn = ? ";
        sql = dbFactory.build_mysql_format(sql, [req.body.data.machineSn]);
        dbFactory.action_db(sql, statusData, res);
    },

    /* End of MachineManage API */

    /* AbnormalAlert API */
    select_error_log: function(req, res){
        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: " Some error occurred while select_data_year"
        }

        let sql =   " SELECT "                                                                                          +
                        " machine_info.machine_sn, "                                                                    +
                        " machine_info.machine_name, "                                                                  +
                        " DATE_FORMAT(error_log.start_datetime,'%Y-%m-%d %H:%i:%s') as start_datetime, "                +
                        " DATE_FORMAT(error_log.end_datetime,'%Y-%m-%d %H:%i:%s') as end_datetime, error_log.event "    +
                    " FROM "                                                                                            +
                        " ((error_log "                                                                                 +
                    " INNER JOIN "                                                                                      +
                        " equipment_info ON error_log.mac = equipment_info.mac) "                                       +
                    " INNER JOIN "                                                                                      +
                        " machine_info ON equipment_info.machine_sn = machine_info.machine_sn) ";

        dbFactory.action_db_with_cb(sql, statusData, (result) => {
            res.status(statusData.successCode).send(result);
        });
    },
    /* End of Abnormal API */


    /* Unused API */
    select_machine_list: function(req, res) {
        statusDataCommon['errorMsg'] = "Some error occurred while select_machine_list";

        let sql =   " SELECT "              +
                        " machine_name, "   +
                        " `type`, "         +
                        " year_elec, "      +
                        " month_elec, "     +
                        " voltage, "        +
                        " work_years, "     +
                        " work_hours, "     +
                        " activation "      +
                    " FROM "                +
                        " enms.machine_info ";
        if(req.body.data.factory) {
            let factorySql = sql + " WHERE factory = ? ";
            sql = dbFactory.build_mysql_format(factorySql, [req.body.data.factory]);
        }
        else {
            sql = dbFactory.build_mysql_format(sql);
        }

        dbFactory.action_db(sql, statusDataCommon, res);

    },
    /* End of Unused API */
}
