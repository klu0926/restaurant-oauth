const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

console.log('connecting to MongoDB...')

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB connection error!')
})

db.once('open', () => {
  console.log('MongoDB connected!')
})

module.exports = db