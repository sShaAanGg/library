var express = require('express')
var router = express.Router()

var api = require('../api/api_enms')


/*========================================================== */
//  tcp client
/*========================================================== */
router.post('/send_switch_socket', function (req, res) {
    api.send_switch_socket(req, res)
})

module.exports = router
