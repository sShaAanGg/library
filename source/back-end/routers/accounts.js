var express = require('express')
var router = express.Router()

var api = require('../api/api_accounts')

router.post('/login', function (req, res) {
    api.login(req, res)
})

router.patch('/show_user_accounts', function (req, res) {
    api.show_user_accounts(req, res)
})

router.get('/show_admin_accounts', function (req, res) {
    api.show_admin_accounts(req, res)
})

router.get('/all_accounts', function (req, res) {
    api.all_accounts(req, res)
})

router.post('/insert_accounts', function (req, res) {
    api.insert_accounts(req, res)
})

router.patch('/update_accounts', function (req, res) {
    api.update_accounts(req, res)
})

router.patch('/update_password', function (req, res) {
    api.update_password(req, res)
})

router.post('/delete_accounts', function (req, res) {
    api.delete_accounts(req, res)
})

router.post('/search_accounts', function (req, res) {
    api.search_accounts(req, res)
})

module.exports = router
