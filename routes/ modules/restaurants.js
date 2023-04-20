const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const restaurant = require('../../models/restaurant')

// Create Page
router.get('/create', (req, res) => {
  res.render('create')
})

// Create
router.post('/create', async (req, res) => {
  const data = req.body
  let { name, category, rating, description, location } = data
  const userId = req.user._id

  // 檢查必要資料
  name = name.trim()
  if (!name || !category || !rating || !description) {
    res.locals.warning_msg = '必要資訊(Require) 都是必填的唷。'
    return res.render('create', { data })
  }

  // 有填地址的話就幫忙製作google地圖連結
  if (location.trim() !== '') {
    const encodedInput = data.location
    const googleMapLink = `https://www.google.com/maps?q=${encodedInput}`
    data.google_map = googleMapLink
  }

  // 設定餐廳的userId
  data.userId = userId

  // 製作餐廳資料
  Restaurant.create({ ...data })
    .then(() => {
      res.redirect('/')
    })
    .catch(error => {
      console.log(error)
    })
})


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
