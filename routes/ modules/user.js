const express = require('express')
const router = express.Router()
const passport = require('passport')


// Login Get
router.get('/login', (req, res) => {
  res.render('login')
})

// Login Post
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
})
)

// Register Get
router.get('/register', (req, res) => {
  res.render('register')
})

// Register Post
router.post('/register', (req, res) => {
  //
})

// Logout Delete
router.delete('/logout', (req, res) => {
  req.logOut((error) => {
    if (error) { return console.log(error) }
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/user/login')
  })
})

module.exports = router