const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
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