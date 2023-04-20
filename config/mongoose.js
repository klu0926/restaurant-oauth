const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  console.log('dot env required')
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

console.log('connecting to MongoDB...')

const db = mongoose.connection

db.on('error', error => console.log(error))

db.once('open', () => console.log('MongoDB connected'))

module.exports = db
