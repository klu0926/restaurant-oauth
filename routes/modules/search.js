const router = require('express').Router()
const Restaurant = require('../../models/restaurant')

// search
router.get('/', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.trim()
  const lowerKeyWord = keyword.toLowerCase()
  const sort = req.query.sort
  const sortObject = {}

  // 沒有輸入內容就轉去 /restaurants
  if (!keyword && !sort) return res.redirect('/restaurants')

  // create mongoose sort object key:value (asc / desc)
  if (sort) {
    const sortArray = sort.split('-')
    const key = sortArray[0]
    const value = sortArray[1]
    sortObject[key] = value
  }

  Restaurant.find({ userId })
    .lean()
    .sort(sortObject)
    .then(restaurants => {
      // 檢查使用者是否有任何餐廳，沒有就轉回/restaurants
      if (!restaurants) {
        req.flash('noData', true)
        return res.redirect('/restaurants')
      }
      return restaurants
    })
    .then(restaurants => {
      return restaurants.filter(restaurant => {
        return (restaurant.name.toLowerCase().includes(lowerKeyWord) ||
          restaurant.category.toLowerCase().includes(lowerKeyWord)
        )
      })
    })
    .then(filterData => {
      res.render('index', { restaurants: filterData, keyword, sort })
    })
    .catch(error => {
      console.log(error)
    })
})

module.exports = router
