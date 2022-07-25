var express = require('express')
var router = express.Router()

var api = require('../api/api_posts')

router.get('/show_post', function (req, res) {
    api.show_post(req, res)
})

router.post('/show_search', function (req, res) {
    api.show_search(req, res)
})

router.post('/update_post', function (req, res) {
    api.update_post(req, res)
})

router.post('/insert_post', function (req, res) {
    api.insert_post(req, res)
})

router.post('/delete_post', function (req, res) {
    api.delete_post(req, res)
})

module.exports = router
