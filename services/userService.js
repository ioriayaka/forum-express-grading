const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship


const helpers = require('../_helpers')

const userService = {
  // profile
  // 取得 profile page
  getUser: (req, res, callback) => {
    const id = req.params.id
    const loginUserId = helpers.getUser(req).id
    User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    }).then((user) => {
      // 是否已追蹤此 user
      const isFollowed = user.Followers.map((d) => d.id).includes(loginUserId)
      // 收藏的餐廳
      let restaurants = user.dataValues.FavoritedRestaurants
      restaurants = user.dataValues.FavoritedRestaurants.map(restaurant => ({
        ...restaurant.dataValues,
      }))
      const resNum = Number(restaurants.length)
      // 評論過餐廳
      let comments = user.dataValues.Comments
      comments = comments.map(comment => ({
        ...comment.dataValues,
        commentedRestaurants: comment.Restaurant.dataValues
      }))
      let result = []
      comments.forEach(comment => result.push(comment.commentedRestaurants))
      // 剔除重複餐廳
      const set = new Set()
      const commentedRes = result.filter(res => !set.has(res.id) ? set.add(res.id) : false)
      const comNum = Number(commentedRes.length)
      // Followers
      let followers = user.dataValues.Followers
      followers = followers.map(follower => ({
        ...follower.dataValues,
      }))
      const followerNum = Number(followers.length)
      // Followings
      let followings = user.dataValues.Followings
      followings = followings.map(following => ({
        ...following.dataValues,
      }))
      const followingNum = Number(followings.length)

      return callback({ userProfile: user.toJSON(), loginUserId, resNum, comNum, followerNum, followingNum, restaurants, isFollowed, followers, followings, commentedRes })
    })
  },
  putUser: (req, res, callback) => {
    const { name } = req.body
    const id = req.params.id

    if (Number(id) !== helpers.getUser(req).id) {
      return callback({ status: 'error', message: "cannot edit other user's profile" })
    }

    if (!name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({
              name,
              image: file ? img.data.link : user.image,
            }).then((user) => {
              callback({ status: 'success', message: 'user was successfully to update' })
            })
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({
            name,
            image: user.image,
          }).then((user) => {
            callback({ status: 'success', message: 'user was successfully to update' })
          })
        })
    }
  },
}

module.exports = userService