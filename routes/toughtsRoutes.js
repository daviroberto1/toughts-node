const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtsController')

// helpers 
const checkAuth = require('../helpers/auth').checkAuth

// controller

router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.post('/likePost', checkAuth, ToughtController.likePost);
router.post('/deslikePost',checkAuth, ToughtController.deslikePost);
router.get('/edit/:id', checkAuth, ToughtController.updateTought)
router.post('/edit', checkAuth, ToughtController.updateToughtSave)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.post('/remove', checkAuth, ToughtController.removeTought)
router.get('/', ToughtController.showToughts)

module.exports = router;