if (process.env.DOT_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const User = require('../user')
const Restaurant = require('../restaurant')
const bcrypt = require('bcryptjs')

// 種子資料
const RESTAURANTS_DATA = require('../data/restaurant.json').results
const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '123',
    restaurantList: [1, 2, 3]
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '123',
    restaurantList: [4, 5, 6]
  },
]

db.once('open', async () => {
  // create users
  console.log('creating seeder users...')

  return Promise.all(
    SEED_USER.map(async (user) => {
      try {
        // 做出使用者
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        const createdUser = await User.create({
          name: user.name,
          email: user.email,
          password: hash
        })
        console.log(`user ${user.name} created!`)

        // 使用 index 從json檔案 找出這名使用者全部餐廳
        const userRestaurants = user.restaurantList.map(index => {
          const restaurant = RESTAURANTS_DATA[index]
          restaurant.userId = createdUser._id
          return restaurant
        })

        // 做這名使用者全部的餐廳資料
        await Restaurant.create(userRestaurants)
        console.log(`${user.name}'s ${user.restaurantList.length} restaurants created!`)

      } catch (err) {
        console.log(err)
      }
    })
  )
    .then(() => {
      console.log('all seeder data created!')
      process.exit()
    })
    .catch(err => {
      console.log(err)
    })
})
