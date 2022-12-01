const { DataTypes } = require('sequelize');

const db = require('../db/conn')

// User
const User = require('./User')

const Tought = db.sequelize.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        require: true,
    },
    deslike: {
        type: DataTypes.INTEGER,
        allowNull: false,
        require: true,
    },
})

Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought;