
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },
  //A17 取得使用者列表
  getUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => {
        res.render('admin/users', { users: users })
      })
      .catch(err => console.error(err))
  },
  //使用者角色權限切換
  toggleAdmin: (req, res) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (user.email === 'root@example.com') {
          req.flash('error_messages', 'The core manager can\'t be changed')
          return res.redirect('back')
        }
        user.isAdmin === false ? user.isAdmin = true : user.isAdmin = false
        return user.update({ isAdmin: user.isAdmin })
          .then(() => {
            req.flash('success_messages', 'already chaneged！')
            res.redirect('/admin/users')
          })
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController