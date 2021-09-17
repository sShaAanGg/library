var request = require('supertest');
var should  = require('should');
var fs      = require('fs');
var mysql   = require('mysql')

// class file
var db = require('../utility/DbFactory');
const { resolve } = require('app-root-path');

describe('Test for EnMS api', function () {
    let server;
    let schemaName = 'enms_test'
    let sqlConnection = mysql.createConnection({
        host: "localhost",
        user: "b85c",
        port: 3306,
        password: "Expansion@b85c"
    })
    let database = new db.DbFactory(
        'localhost',
        'b85c',
        'Expansion@b85c',
        'enms_test',
        3306,
        true
    );

    before(() => {
        // console.log('Initialing database....')
        // return new Promise((resolve) => {
        //     let sql = fs.readFileSync('./jingfongdb20210906_uint_test.sql').toString()
        //     create_schema(schemaName, sqlConnection)
        //         .then(() => {
        //             database.action_db_with_cb(sql,200, res=>{
        //                 console.log('Initial complete!')
        //                 resolve()
        //             })
        //         })
        //         .catch(() => {
        //             console.log('Unit testing stopped due to "Create Schema Error", Please check your sql statement.')
        //         })
        // })
    })

    after(() => {
        // console.log('Clearing database...')
        // return new Promise((resolve) => {
        //     drop_schema(schemaName, sqlConnection)
        //         .then(() => {
        //             console.log('All test data had been removed!')
        //             resolve()
        //         })
        //         .catch(() => {
        //             console.log('Unit testing stopped due to "Create Schema Error", Please check your sql statement.')
        //         })
        // })
    })
    beforeEach(() => {
        server = require('../server');
    });

    afterEach(() => {
        server.close();
    })

    function drop_schema(name, sqlConnection) {
        return new Promise((resolve, reject) => {
            sqlConnection.connect(err => {
                sqlConnection.query(`DROP SCHEMA IF EXISTS ${name}`,() => {
                    resolve(`Drop schema ${name} success!`)
                })
            })
        })
    }

    function create_schema(name, sqlConnection) {
        return new Promise((resolve, reject) => {
            sqlConnection.connect(err => {
                sqlConnection.query(`CREATE SCHEMA IF NOT EXISTS ${name}`,() => {
                    resolve(`Create schema ${name} success!`)
                })
            })
        })
    }

    function is_object(obj) {
        return typeof obj === 'object' && !!obj;
    };

    function diff(a, b) {
        if (!is_object(a) || !is_object(b)) {
            throw new TypeError(' a or b is invalid json');
        }

        let keys = Object.keys(a);

        if (keys.length == 0) {
            return JSON.stringify(a) === JSON.stringify(b);
        }

        let aValue, bValue, key;

        for (key of keys) {
            aValue = a[key];
            bValue = b[key];

            if (is_object(aValue) && is_object(bValue)) {
                return diff(aValue, bValue);
            } else if (aValue !== bValue) {
                return false;
            }
        }

        return true;
    };

    it('EnMS: /api/enms/select_current_month_cumulative_electricity_consumption', function(done) {
        let goldenValues = 200;

        request(server)
            .get('/api/enms/select_current_month_cumulative_electricity_consumption')
            .expect(200)
            .end((err, res) => {
                (res.statusCode == goldenValues).should.equal(true);

                if (err) {
                    console.log("erro message:"+err);
                    return done(err)
                }
 
                return done()
            })
    });

    it('EnMS: /api/enms/select_real_time_electricity_consumption', function(done) {
        let goldenValues = '1.1';

        request(server)
            .get('/api/enms/select_real_time_electricity_consumption')
            .expect(200)
            .end((err, res) => {
                (res.text == goldenValues).should.equal(true);

                if (err) {
                    console.log("erro message:"+err);
                    return done(err)
                }
 
                return done()
            })
    });

    it('EnMS: /api/enms/select_two_years_electricity_consumption', function(done) {
        let goldenValues = [
            {
                "id": 2,
                "mac": "11111111",
                "yearmonth": 20200200000000,
                "electricity": "5737.00"
            },
            {
                "id": 3,
                "mac": "11111111",
                "yearmonth": 20200300000000,
                "electricity": "6123.00"
            },
            {
                "id": 4,
                "mac": "11111111",
                "yearmonth": 20200400000000,
                "electricity": "5941.70"
            },
            {
                "id": 5,
                "mac": "11111111",
                "yearmonth": 20200500000000,
                "electricity": "6137.27"
            },
            {
                "id": 6,
                "mac": "11111111",
                "yearmonth": 20200600000000,
                "electricity": "5924.31"
            },
            {
                "id": 7,
                "mac": "11111111",
                "yearmonth": 20200700000000,
                "electricity": "6125.43"
            },
            {
                "id": 8,
                "mac": "11111111",
                "yearmonth": 20200800000000,
                "electricity": "6127.56"
            },
            {
                "id": 9,
                "mac": "11111111",
                "yearmonth": 20200900000000,
                "electricity": "5926.67"
            },
            {
                "id": 10,
                "mac": "11111111",
                "yearmonth": 20201000000000,
                "electricity": "6136.80"
            },
            {
                "id": 11,
                "mac": "11111111",
                "yearmonth": 20201100000000,
                "electricity": "5939.27"
            },
            {
                "id": 12,
                "mac": "11111111",
                "yearmonth": 20201200000000,
                "electricity": "6129.19"
            },
            {
                "id": 13,
                "mac": "11111111",
                "yearmonth": 20210100000000,
                "electricity": "6130.76"
            },
            {
                "id": 14,
                "mac": "11111111",
                "yearmonth": 20210200000000,
                "electricity": "5523.96"
            },
            {
                "id": 15,
                "mac": "11111111",
                "yearmonth": 20210300000000,
                "electricity": "6130.51"
            },
            {
                "id": 16,
                "mac": "11111111",
                "yearmonth": 20210400000000,
                "electricity": "5919.45"
            },
            {
                "id": 17,
                "mac": "11111111",
                "yearmonth": 20210500000000,
                "electricity": "6118.82"
            },
            {
                "id": 18,
                "mac": "11111111",
                "yearmonth": 20210600000000,
                "electricity": "5923.74"
            },
            {
                "id": 19,
                "mac": "11111111",
                "yearmonth": 20210700000000,
                "electricity": "6115.30"
            },
            {
                "id": 20,
                "mac": "11111111",
                "yearmonth": 20210800000000,
                "electricity": "6122.67"
            },
            {
                "id": 21,
                "mac": "11111111",
                "yearmonth": 20210900000000,
                "electricity": "5924.97"
            }
        ];

        request(server)
            .get('/api/enms/select_two_years_electricity_consumption')
            .expect(200)
            .end((err, res) => {
                diff(res.body, goldenValues).should.equal(true);

                if (err) {
                    console.log("erro message:"+err);
                    return done(err)
                }
 
                return done()
            })
    });

    it('EnMS: /api/enms/select_event_log', function(done) {
        let goldenValues = [
            {
                "id": 1,
                "mac": "11111111",
                "datetime": 20210915235740,
                "event": "功率過高"
            },
            {
                "id": 2,
                "mac": "11111111",
                "datetime": 20210903225740,
                "event": "功率過高"
            },
            {
                "id": 3,
                "mac": "11111111",
                "datetime": 20210901215740,
                "event": "功率過高"
            }
        ];

        request(server)
            .get('/api/enms/select_event_log')
            .expect(200)
            .end((err, res) => {
                diff(res.body, goldenValues).should.equal(true);

                if (err) {
                    console.log("erro message:"+err);
                    return done(err)
                }
 
                return done()
            })
    });

    it('EnMS Cron: /api/enms/insert_history_month_cumulative_electricity_consumption', function(done) {
        let goldenValues = [
            {
                "mac": "11111111",
                "datetime": "20210800000000",
                "electricity": "6122.67"
            }
        ];

        request(server)
            .get('/api/cron/insert_history_month_cumulative_electricity_consumption')
            .expect(200)
            .end((err, res) => {
                diff(res.body, goldenValues).should.equal(true);

                if (err) {
                    console.log("erro message:"+err);
                    return done(err)
                }
 
                return done()
            })
    });

});
