const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 其中 email 與密碼是必填欄位，但名字不是
const userSchema = new Schema({
  name: {
    type: String,
    require: true,
    default: '愛美食不留名'
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)