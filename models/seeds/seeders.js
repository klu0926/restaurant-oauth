if (process.env.DOT_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const User = require('../user')
const Restaurant = require('../restaurant')
const bcrypt = require('bcryptjs')

// 種子資料
const RESTAURANTS_DATA = require('../data/restaurant.json').results
const SEEDER_USER_1 = { email: 'user1@example.com', password: '12345678' }
const SEEDER_USER_2 = { email: 'user2@example.com', password: '12345678' }
const SEEDER_USERS = [SEEDER_USER_1, SEEDER_USER_2]

// 使用幾個餐廳資料 (最多8個)
const restaurantsAmount = 6

// 種子使用者擁有的餐廳 (每個餐廳都需要分配到)
const user1RestaurantList = [1, 2, 3]
const user2RestaurantList = [4, 5, 6]

db.once('open', async () => {
  // create users
  console.log('creating seeder users...')
  const users = []

  return Promise.all(
    SEEDER_USERS.map(seederUser => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(seederUser.password, salt))
        .then(hash => User.create({ email: seederUser.email, password: hash }))
        .then(user => {
          users.push(user)
        })
    })
  )
    // create restaurant
    .then(() => {
      console.log('creating seeder restaurants...')
      // slice restaurant data
      const sliceData = RESTAURANTS_DATA.slice(0, restaurantsAmount)

      return Promise.all(
        sliceData.map(data => {
          // 餐廳登記為 使用者1
          if (user1RestaurantList.includes(data.id)) {
            data.userId = users[0]._id
          }

          // 餐廳登記為 使用者2
          if (user2RestaurantList.includes(data.id)) {
            data.userId = users[1]._id
          }
          // 做餐廳資料
          return Restaurant.create(data)
        })
      )
    })
    .then(() => {
      console.log('Seeder all done!')
      process.exit()
    })
})
