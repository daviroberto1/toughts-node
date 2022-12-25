const express = require('express')
const router = express.Router()
const UserLikeController = require('../controllers/UserLikeController')

// helpers 
const checkAuth = require('../helpers/auth').checkAuth

// controller
router.post('/userLikePost', checkAuth, UserLikeController.userLikePost);
router.post('/userDeslikePost',checkAuth, UserLikeController.userDeslikePost);

module.exports = router;