const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const { isAuthenticated, isNotAuthenticated } = require('../../middleware/auth')


// Login Get
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login')
})

// Login Post
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
})
)
// Register Get
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register')
})

// Register Post
router.post('/register', (req, res, next) => {
  let { name, email, password, confirmPassword } = req.body
  const errors = []

  // 檢查是否有漏資料 (name不需要)
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了Name以外都是必填。' })
  }

  // 檢查 confirm password
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }

  // 以上有問題就回傳 error
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // 用 email 找使用者
  User.findOne({ email }).then(user => {

    // 找到已經有使用者用這email
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    // 都沒問題，開始製作使用者資料

    // 檢查使用者是否有輸入name，沒有就幫他取一個接地氣的名字
    if (name === '') {
      name = "愛美食不留名"
    }
    // 製作密碼
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        return User.create({
          name,
          email,
          password: hash
        })
      })
      .then(() => next())
      .catch(err => console.log(err))
  })
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
}
))

// Logout Delete
router.delete('/logout', (req, res) => {
  req.logOut((error) => {
    if (error) { return console.log(error) }
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/user/login')
  })
})

module.exports = router