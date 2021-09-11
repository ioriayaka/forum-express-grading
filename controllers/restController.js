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
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' }
        ]
      }),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { restaurantId: req.params.id }
      })
    ])
      .then(([restaurant, comments]) => {
        const favoritedUserNum = restaurant.FavoritedUsers.length
        return res.render('dashboard', {
          restaurant: restaurant.toJSON(),
          commentCount: comments.count,
          favoritedUserNum
        })
      })
  },
  //A22 TOP 10 人氣餐廳功能
  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.description.slice(0, 50),
          favoriteCounts: restaurant.FavoritedUsers.length,
          isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        }))
        restaurants.sort((a, b) => b.favoriteCounts - a.favoriteCounts)
        restaurants = restaurants.slice(0, 10)
        return res.render('topRestaurant', { restaurants })
      })
  }
}

module.exports = restController