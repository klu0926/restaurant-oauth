const express = require('express')
const router = express.Router()


// Login Get
router.get('/login', (req, res) => {
  res.send('user/login')
})

// Login Post
router.post('/login', (req, res) => {
  //
})

// Register Get
router.get('/register', (req, res) => {
  res.send('user/register')
})

// Register Post
router.post('/register', (req, res) => {
  //
})

// Logout Delete
router.delete('/logout', (req, res) => {
  //
})

module.exports = router