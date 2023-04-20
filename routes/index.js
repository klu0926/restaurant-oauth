const express = require('express')
const router = express.Router()

const home = require('./ modules/home')
const restaurants = require('./ modules/restaurants')
const user = require('./ modules/user')
const auth = require('./ modules/auth')
const { isAuthenticated } = require('../middleware/auth')

router.use('/restaurants', isAuthenticated, restaurants)
router.use('/user', user)
router.use('/auth', auth)
router.use('/', isAuthenticated, home)

module.exports = router