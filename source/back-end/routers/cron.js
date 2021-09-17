var express = require('express');
var router = express.Router();

var api = require('../api/api_cron');

router.get('/insert_history_month_cumulative_electricity_consumption', function (req, res) {
    api.insert_history_month_cumulative_electricity_consumption(req, res);
});


module.exports = router;