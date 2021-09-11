const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/api/userController.js')
const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')
const categoryService = require('../services/categoryService.js')
const restController = require('../controllers/api/restController.js')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/', authenticated, (req, res) => res.redirect('/api/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

//admin restaurants page
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
// admin restaurant page
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)

// admin restaurant post
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// admin put restaurant
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
// admin restaurants delete
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

// admin categories
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

// JWT signin
router.post('/signin', authenticated, authenticatedAdmin, userController.signIn)
router.post('/signup', userController.signUp)
module.exports = router