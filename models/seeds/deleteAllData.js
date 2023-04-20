const db = require('../../config/mongoose')
const Restaurant = require('../../models/restaurant')
const User = require('../../models/user')

db.once('open', async () => {
  console.log('deleting all data...')

  await Restaurant.deleteMany({})

  console.log('Restaurants data deleted')

  await User.deleteMany({})
  console.log('Users data deleted')
  console.log('All data deleted!')
  process.exit()
})
