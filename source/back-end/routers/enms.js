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
//      Dashboard
//      Analysis
//      ProductionLineAnalysis
//      DemandPredict
//      MachineManage
//      AbnormalAlert
//      Unused
/*========================================================== */

/* Dashboard API */
router.get('/select_current_month_cumulative_electricity_consumption', function (req, res) {
    api.select_current_month_cumulative_electricity_consumption(req, res);
});
router.get('/select_two_years_electricity_consumption', function (req, res) {
    api.select_two_years_electricity_consumption(req, res);
});
router.get('/select_two_years_elec', function (req, res) {
    api.select_two_years_elec(req, res);
});
router.get('/select_real_time_electricity_consumption', function (req, res) {
    api.select_real_time_electricity_consumption(req, res);
});
router.get('/select_event_log', function (req, res) {
    api.select_event_log(req, res);
});
router.get('/select_every_years_average', function (req, res) {
    api.select_every_years_average(req, res);
});
router.post('/select_equip_controllers', function (req, res) {
    api.select_equip_controllers(req, res);
});
/* End of Dashboard API */

/* Analysis API */
router.get('/select_data_year', function (req, res) {
    api.select_data_year(req, res);
});
router.post('/select_two_years_electricity_consumption_for_anslysis', function (req, res) {
    api.select_two_years_electricity_consumption_for_anslysis(req, res);
});
/* End of Analysis API */

/* ProductionLineStatusAnalysis */
router.post('/select_factory_machine_monthly_info', function (req, res) {
    api.select_factory_machine_monthly_info(req, res);
});
router.post('/select_equip_error_log', function (req, res) {
    api.select_equip_error_log(req, res);
});
router.post('/select_equip_daily_elec_yoy', function (req, res) {
    api.select_equip_daily_elec_yoy(req, res);
});
router.post('/select_equip_daily_elec_this_month', function (req, res) {
    api.select_equip_daily_elec_this_month(req, res);
});
/* End of ProductionLineStatusAnalysis */

/* DemandPredict API */
router.post('/select_predict_capacity', function (req, res) {
    api.select_predict_capacity(req, res);
});
router.post('/select_current_capacity', function (req, res) {
    api.select_current_capacity(req, res);
});
router.post('/select_machine_info_for_demand_predict', function (req, res) {
    api.select_machine_info_for_demand_predict(req, res);
});
/* End of DemandPredict API */

/* MachineManage API */
router.post('/select_machine_manage', function (req, res) {
    api.select_machine_manage(req, res);
});
router.post('/insert_machine_manage', function (req, res) {
    api.insert_machine_manage(req, res);
});
router.post('/update_machine_manage', function (req, res) {
    api.update_machine_manage(req, res);
});
router.post('/delete_machine_manage', function (req, res) {
    api.delete_machine_manage(req, res);
});
router.post('/select_machine_sn', function (req, res) {
    api.select_machine_sn(req, res);
});
/* End of MachineManage API */

/* AbnormalAlert API */
router.get('/select_error_log', function (req, res) {
    api.select_error_log(req, res);
});
/* End of AbnormalAlert API */

/* Unused API */
router.post('/select_machine_list', function (req, res) {
    api.select_machine_list(req, res);
});
/* End of Unused API */







module.exports = router;
