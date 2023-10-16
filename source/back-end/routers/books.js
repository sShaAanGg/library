var express = require('express')
const multer = require('multer');
var router = express.Router()

var api = require('../api/api_books')

router.get('/show_all_books', function (req, res) {
    api.show_all_books(req, res)
})

router.post('/show_collect_books', function (req, res) {
    api.show_collect_books(req, res)
})

router.post('/show_borrow_books', function (req, res) {
    api.show_borrow_books(req, res)
})

router.post('/show_history_books', function (req, res) {
    api.show_history_books(req, res)
})

router.post('/show_reserve_books', function (req, res) {
    api.show_reserve_books(req, res)
})


router.patch('/add_to_collect', function (req, res) {
    api.add_to_collect(req, res)
})

router.patch('/borrow_books', function (req, res) {
    api.borrow_books(req, res)
})

router.patch('/check_is_reserve', function (req, res) {
    api.check_is_reserve(req, res)
})

router.patch('/reserve_books', function (req, res) {
    api.reserve_books(req, res)
})

router.patch('/cancel_reserve', function (req, res) {
    api.cancel_reserve(req, res)
})

router.patch('/reserve_to_borrow', function (req, res) {
    api.reserve_to_borrow(req, res)
})

router.patch('/return_books', function (req, res) {
    api.return_books(req, res)
})

router.post('/search_by_name', function (req, res) {
    api.search_by_name(req, res)
})

router.post('/search_by_author', function (req, res) {
    api.search_by_author(req, res)
})

router.post('/search_by_publish', function (req, res) {
    api.search_by_publish(req, res)
})

router.post('/search_all', function (req, res) {
    api.search_all(req, res)
})

router.post('/delete_book', function (req, res) {
    api.delete_book(req, res)
})

router.post('/insert_book', function (req, res) {
    api.insert_book(req, res)
})

router.post('/update_book', function (req, res) {
    api.update_book(req, res)
})

module.exports = router
