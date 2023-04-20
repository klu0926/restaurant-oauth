const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Create
// Read 
router.get('/', (req, res) => {
  const userId = req.user._id

  // 只會顯示屬於自己的餐廳
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => { res.render('index', { restaurants }) })
    .catch(err => console.log(err))
})

// Update
// Delete


module.exports = router
