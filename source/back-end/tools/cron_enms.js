const cronJob = require('cron').CronJob;
const axios = require('axios');

//每個月執行一次更新歷史總消耗電量
var job = new cronJob('0 0 0 1 */1 *', function() {

    axios
        .get('http://localhost:5000/api/cron/insert_history_month_cumulative_electricity_consumption')
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.error("發生錯誤!");
            console.log(error);
        })
}, null, true);
job.start();