const { DataTypes } = require('sequelize');

const db = require('../db/conn');

// User
const Tought = require('./Tought')
const User = require('./User')

const UserLike = db.sequelize.define('UserLike', {
    like: {
        type: DataTypes.BOOLEAN
    },
    deslike: {
        type: DataTypes.BOOLEAN
    }
})

UserLike.belongsTo(User)
UserLike.belongsTo(Tought)
User.hasMany(UserLike)
Tought.hasMany(UserLike)


module.exports = UserLike;