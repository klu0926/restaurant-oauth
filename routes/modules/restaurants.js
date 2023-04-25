const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const categories = require('../../models/data/categories.json')
const counties = require('../../models/data/tw-zip-code.json').cities

// 新增餐廳 GET
router.get('/create', (req, res) => {

  res.render('create', { categories, counties })
})


// 新增餐廳 POST
router.post('/create', async (req, res) => {
  const data = req.body
  const userId = req.user._id

  try {
    // 合併出地址 location
    const location = (data.county + data.district + data.address).trim()

    // location 存入 data
    if (location) {
      data.location = location
    }

    console.log(data.county, data.district, data.address)

    // 必須集合三個地址資料才會做出一個 google map
    if (data.county && data.district && data.address) {
      console.log('做地圖')
      const encodedInput = data.location
      const googleMapLink = `https://www.google.com/maps?q=${encodedInput}`
      data.google_map = googleMapLink
    }


    // 設定餐廳的 userId
    data.userId = userId

    // 製作餐廳資料 後回去餐廳列表
    await Restaurant.create(data)
    res.redirect('/restaurants')

  } catch (err) {
    res.locals.warning_msg = '發生預期外的錯誤，請在嘗試看看'
    console.log(err)
    return res.render('create', { categories, counties })
  }
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

// 更新 get
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant, categories })
    })
    .catch(err => console.log(err))
})

// 更新 put
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body
  const userId = req.user._id

  try {
    // location 存入 data
    if (data.location) {
      // 做出一個 google map
      const encodedInput = data.location
      const googleMapLink = `https://www.google.com/maps?q=${encodedInput}`
      data.google_map = googleMapLink
    } else {
      data.google_map = ''
    }

    // 設定餐廳的 userId
    data.userId = userId

    // 修改餐廳資料
    let restaurant = await Restaurant.findById(id)
    restaurant = Object.assign(restaurant, data)

    // 存資料
    await restaurant.save()

    // 回傳
    res.redirect(`/restaurants/${id}`)
  }
  catch (err) {
    res.locals.warning_msg = '發生預期外的錯誤，請在嘗試看看'
    console.log(err)
    return res.redirect(`/restaurants/${id}`, { categories, counties })
  }
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
