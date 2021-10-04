var CronJob = require('cron').CronJob;

var mysql = require('mysql');
var path = require('path');
var logger = require('./logger');

const dotenvAbsolutePath = path.join(__dirname, '../.env')
const dotenv = require('dotenv').config({
    path: dotenvAbsolutePath
})

if (dotenv.error) {
    logger.error({message: err})
    throw dotenv.error
}

var pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
})

function format(time, format) {
    var t = new Date(time);
    var tf = function (i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}

function asyncQuery(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                resolve(err)
            } else {
                connection.query(sql, (err, rows) => {
                    if (err) {
                        resolve()
                    } else {
                        resolve((JSON.parse(JSON.stringify(rows))))
                    }
                    connection.destroy()
                })
            }
        })
    })
}

async function DataArchivingForDate() {
    var before      = new Date();
    var newDate     = new Date();
    var insertSQL   = ' INSERT INTO history_day_info (mac, datetime, electricity, watt, carbon_footprint, carbon_negative) VALUES '
    var sql;
    
    before = before.setDate(before.getDate()-1)
    before = new Date(before);
    
    
    var startDateTime   = format(before  ,'yyyyMMdd000000');
    var endDateTime     = format(newDate ,'yyyyMMdd000000');
    
    sql = ' SELECT enms_info.mac, count(enms_info.ampere) as count, machine_info.id,machine_info.voltage, DATE_FORMAT(enms_info.datetime,"%Y%m%d") as datetime, SUM(enms_info.ampere) as ampere '           +
    ' FROM ((enms_info INNER JOIN equipment_info ON enms_info.mac = equipment_info.mac) INNER JOIN machine_info ON equipment_info.machine_sn = machine_info.machine_sn) '                                   +
    ' WHERE datetime >= ? AND datetime < ? GROUP BY mac ' 
    sql = mysql.format(sql, [ startDateTime, endDateTime]);
    var result = await asyncQuery(sql);
    
    for (let i = 0; i < result.length; ++i){
        var watt = (result[i].ampere * result[i].voltage * 10) / 1000;
        var electricity = ( watt / Math.round((result[i].count*10) / 24)).toFixed(2);
        var carbon_footprint = (electricity * 0.509).toFixed(2);
        
        sql = ' UPDATE machine_info SET update_date = ?, month_elec = month_elec + ? WHERE id = ? AND DATE_FORMAT(update_date,"%Y%m%d") != DATE_FORMAT(?,"%Y%m%d") ';
        sql = mysql.format(sql, [ format(new Date(),'yyyyMMddHHmmss'), electricity, result[i].id], startDateTime);
        await asyncQuery(sql); 
        
        if (i === result.length - 1){
            sql = ' (?, ?, ?, ?, ?, 0)';
        } else {
            sql = ' (?, ?, ?, ?, ?, 0) , ';
        }

        sql = mysql.format(sql, [ result[i].mac, result[i].datetime + '000000', electricity, watt, carbon_footprint]);
        insertSQL += sql;
    }
    console.log(insertSQL);
    await asyncQuery(insertSQL);
}

async function DataArchivingForMonth() {
    var before  = new Date();
    var newDate  = new Date();
    var insertSQL   = ' INSERT INTO history_month_info (mac, datetime, electricity, watt, carbon_footprint, carbon_negative) VALUES '
    var sql;
    
    before = before.setMonth(before.getMonth()-1)
    before = new Date(before);
    
    var startDateTime   = format(before  ,'yyyyMM01000000');
    var endDateTime     = format(newDate ,'yyyyMM01000000');
    
    sql = ' SELECT history_day_info.mac, history_day_info.datetime, machine_info.id, COUNT(history_day_info.electricity) as count, SUM(history_day_info.electricity) as electricity,  '            +
    ' SUM(history_day_info.watt) as watt, SUM(history_day_info.carbon_footprint) as carbon_footprint, SUM(history_day_info.carbon_negative) as carbon_negative FROM '                                   +
    ' ((history_day_info INNER JOIN equipment_info ON history_day_info.mac = equipment_info.mac) INNER JOIN machine_info ON equipment_info.machine_sn = machine_info.machine_sn) '                      +
    ' WHERE datetime >= ? AND datetime < ? GROUP BY mac ' 
    sql = mysql.format(sql, [ startDateTime, endDateTime]);
    var result = await asyncQuery(sql);
    
    for (let i = 0; i < result.length; ++i){
        sql = ' UPDATE machine_info SET update_date = ?, year_elec = year_elec + ? WHERE id = ?';
        sql = mysql.format(sql, [ format(new Date(),'yyyyMMddHHmmss'), result[i].electricity, result[i].id]);
        await asyncQuery(sql);

        if (i === result.length - 1){
            sql = ' (?, ?, ?, ?, ?, ?)';
        } else {
            sql = ' (?, ?, ?, ?, ?, ?) , ';
        }
        sql = mysql.format(sql, [ result[i].mac, result[i].datetime, result[i].electricity, result[i].watt, result[i].carbon_footprint, result[i].carbon_negative]);
        insertSQL += sql;
    }
    await asyncQuery(sql);
}

var checkInfo01 = new CronJob('0 0 */1 * * *', async function() {
    var before  = new Date();
    var newDate  = new Date();
    var sql;
    
    before = before.setDate(before.getDate()-1)
    before = new Date(before);

    var startDateTime   = format(before  ,'yyyyMMdd000000');
    var endDateTime     = format(newDate ,'yyyyMMdd000000');

    if (before.getHours() == 1)
        return;

    sql = ' SELECT * FROM history_day_info WHERE datetime >= ? AND datetime < ? ';
    sql = mysql.format(sql, [ startDateTime, endDateTime]);
    var result = await asyncQuery(sql);

    if (result.length === 0){
        await DataArchivingForDate();
    }

},null,true);

checkInfo01.start();

var checkInfo02 = new CronJob('0 0 */1 3 * *', async function() {
    var before  = new Date();
    var newDate  = new Date();
    var sql;

    before = before.setMonth(before.getMonth()-1)
    before = new Date(before);

    var startDateTime   = format(before  ,'yyyyMM01000000');
    var endDateTime     = format(newDate ,'yyyyMM01000000');

    if (before.getHours() == 1)
        return;

    sql = ' SELECT * FROM history_month_info WHERE datetime >= ? AND datetime < ? ';
    sql = mysql.format(sql, [ startDateTime, endDateTime]);

    var result = await asyncQuery(sql);

    if (result.length === 0){
        await DataArchivingForMonth();
    }

},null,true);

checkInfo02.start();