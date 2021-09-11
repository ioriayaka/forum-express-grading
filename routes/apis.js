const express = require('express')
const router = express.Router()
// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')
const categoryService = require('../services/categoryService.js')

//admin restaurants page
router.get('/admin/restaurants', adminController.getRestaurants)
// admin restaurant page
router.get('/admin/restaurants/:id', adminController.getRestaurant)
// admin restaurant post
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
// admin put restaurant
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
// admin restaurants delete
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// admin categories
router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategory)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router