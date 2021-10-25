var express = require('express');
var router = express.Router();

var api = require('../api/api_cron');

// router.get('/insert_history_month_cumulative_electricity_consumption', function (req, res) {
//     api.insert_history_month_cumulative_electricity_consumption(req, res);
// });

router.post('/check_button_and_change_button_status', function(req, res) {
    api.check_button_and_change_button_status(req, res);
});


module.exports = router;
