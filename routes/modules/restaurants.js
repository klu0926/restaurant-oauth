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
    .then(restaurants => {
      if (restaurants.length === 0) {
        req.flash('noData', true)
        return res.render('index', { noData: true })
      }

      res.render('index', { restaurants })
    })
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

// Update Page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(err => console.log(err))
})

// Update
router.put('/:id', (req, res) => {
  const id = req.params.id
  const updateData = req.body
  let { name, category, rating, description, location } = updateData

  // 檢查必要資料，有少就提示
  name = name.trim()
  if (!name || !category || !rating || !description) {
    updateData._id = id // 讓 edit form 知道 id
    res.locals.warning_msg = '必要資訊(Require) 都是必填的唷。'
    return res.render('edit', { restaurant: updateData })
  }

  // 有填地址的話就幫忙製作google地圖連結
  if (location.trim() !== '') {
    const encodedInput = updateData.location
    const googleMapLink = `https://www.google.com/maps?q=${encodedInput}`
    updateData.google_map = googleMapLink
  }

  // 修改餐廳資料
  Restaurant.findById(id)
    .then(restaurant => {
      for (const key in updateData) {
        if (key in restaurant) {
          restaurant[key] = updateData[key]
        }
      }
      return restaurant.save()
    })
    .then(() => {
      res.redirect(`/restaurants/${id}`)
    })
    .catch(error => {
      console.log(error)
    })
})


// Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id

  Restaurant.findById(id)
    .then(restaurant => restaurant.deleteOne())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


module.exports = router
