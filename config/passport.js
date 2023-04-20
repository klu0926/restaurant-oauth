const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')


// 
// export this function, to use in app.js
module.exports = function passportSetup(app) {

  // 1. init 初始化
  app.use(passport.initialize())
  app.use(passport.session())

  // 2. Strategy : LocalStrategy( {設定}, 驗證func)
  passport.use(new LocalStrategy({
    // 設定
    usernameField: 'email',
    passReqToCallback: true,

  }, (req, email, password, done) => {
    // 用email查詢使用者
    User.findOne({ email })
      .then(user => {
        // 使用者不存在
        if (!user) {
          return done(null, false, req.flash('warning_msg', 'That email is not registered!'))
        }

        // 使用bcrypt檢查密碼
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', 'Email or Password incorrect!'))
            }
            // 通過檢查，回傳使用者
            return done(null, user)
          })
      })
      .catch(error => done(error, false))
  }))
}

// 3. 序列化(第一次登入) 與 反序列化(登入以後)
// serializeUser
passport.serializeUser((user, done) => {
  return done(null, user.id)
})
// deserializeUser
passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(error => done(error, null))
})