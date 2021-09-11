const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10
const Comment = db.Comment
const User = db.User
const helpers = require('../_helpers')

const restService = require('../services/restService.js')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      res.render('restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      res.render('restaurant', data)
    })
  },
  //Feeds 最新動態
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },
  // A20 Dashboard 功能
  getDashboard: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      res.render('dashboard', data)
    })
  },
  //A22 TOP 10 人氣餐廳功能
  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, (data) => {
      return res.render('topRestaurant', data)
    })
  }
}

module.exports = restController