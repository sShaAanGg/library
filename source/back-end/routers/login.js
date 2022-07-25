var express = require('express')
var router = express.Router()

var api = require('../api/api_login')

router.post('/login', function (req, res) {
    api.login(req, res)
})


module.exports = router
