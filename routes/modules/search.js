const router = require('express').Router()
const Restaurant = require('../../models/restaurant')

// search
router.get('/', (req, res) => {
  const userId = req.user._id
  const userHasRestaurant = false
  const keyword = req.query.keyword.trim()
  const lowerKeyWord = keyword.toLowerCase()
  const sort = req.query.sort
  const sortObject = {}

  // if no search is input back to /
  if (!keyword) return res.redirect('/')

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