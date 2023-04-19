if (process.env.DOT_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const restaurantsData = require('./restaurant.json').results
const User = require('../user')
const Restaurant = require('../restaurant')
const bcrypt = require('bcryptjs')
const restaurant = require('../restaurant')

const SEEDER_USER_1 = { email: 'user1@example.com', password: '12345678' }
const SEEDER_USER_2 = { email: 'user2@example.com', password: '12345678' }
const SEEDER_USERS = [SEEDER_USER_1, SEEDER_USER_2]
const dataAmount = 6

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
      sliceData = restaurantsData.slice(0, dataAmount)

      return Promise.all(
        sliceData.map(data => {
          // #1, 2, 3
          if (Number(data.id) < 4) {
            data.userId = users[0]._id
          }
          // #4, 5, 6
          if (Number(data.id) >= 4 && Number(data.id) <= 6) {
            data.userId = users[1]._id
          }
          return Restaurant.create(data)
        })
      )
    })
    .then(() => {
      console.log('All done')
      process.exit()
    })
})