const express = require('express')
const router = express.Router()
const cities = require('../../models/data/tw-zip-code.json').cities

router.get('/zipcode', (req, res) => {
  res.json(cities)
})

module.exports = router
