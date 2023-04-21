const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 其中 email 與密碼是必填欄位，但名字不是
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: '愛美食不留名'
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
