'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Comment)
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedRestaurants'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
// 以下是使用 sequelize.define 的版本
// 'use strict'
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING
//     password: DataTypes.STRING,
//     isAdmin: DataTypes.BOOLEAN
//   }, {})
//   User.associate = function (models) {
//     // associations can be defined here
//   }
//   return User
// }