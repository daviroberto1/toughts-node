const User = require('../models/User')
const Tought = require('../models/Tought')
const UserLike = require('../models/UserLike')

module.exports = class UserLikeController {

    static async login(req,res) {
        res.render('auth/login')
    }

}