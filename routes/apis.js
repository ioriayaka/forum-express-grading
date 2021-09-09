const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')
const categoryService = require('../services/categoryService.js')

//admin restaurants page
router.get('/admin/restaurants', adminController.getRestaurants)
// admin restaurant page
router.get('/admin/restaurants/:id', adminController.getRestaurant)
// admin categories page
router.get('/admin/categories', categoryController.getCategories)

module.exports = router