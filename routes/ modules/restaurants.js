const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const restaurant = require('../../models/restaurant')

// Create
// Read All
router.get('/', (req, res) => {
  const userId = req.user._id

  // 只會顯示屬於自己的餐廳
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => { res.render('index', { restaurants }) })
    .catch(err => console.log(err))
})

// Read One
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('detail', { restaurant })
    })
    .catch(err => console.log(err))
})

// Update


// Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id

  Restaurant.findById(id)
    .then(restaurant => restaurant.deleteOne())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


module.exports = router
