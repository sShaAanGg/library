var express = require('express');
var router = express.Router();

var api = require('../api/api_enms');


/*========================================================== */
//  tcp client
/*========================================================== */
router.post('/send_switch_socket', function (req, res) {
    api.send_switch_socket(req, res);
});

/*========================================================== */
//  enms api
/*========================================================== */
router.get('/select_current_month_cumulative_electricity_consumption', function (req, res) {
    api.select_current_month_cumulative_electricity_consumption(req, res);
});

router.get('/select_real_time_electricity_consumption', function (req, res) {
    api.select_real_time_electricity_consumption(req, res);
});

router.get('/select_two_years_electricity_consumption', function (req, res) {
    api.select_two_years_electricity_consumption(req, res);
});

router.get('/select_event_log', function (req, res) {
    api.select_event_log(req, res);
});

router.post('/select_equip_controllers', function (req, res) {
    api.select_equip_controllers(req, res);
});

router.post('/select_machine_list', function (req, res) {
    api.select_machine_list(req, res);
});

router.get('/select_data_year', function (req, res) {
    api.select_data_year(req, res);
});

router.post('/select_two_years_electricity_consumption_for_anslysis', function (req, res) {
    api.select_two_years_electricity_consumption_for_anslysis(req, res);
});

router.get('/select_error_log', function (req, res) {
    api.select_error_log(req, res);
});

module.exports = router;
