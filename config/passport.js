const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
        // 檢查使用者存在
        if (!user) {
          return done(null, false, req.flash('warning_msg', '這Email沒有被註冊過。'))
        }

        // 使用bcrypt檢查密碼
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', 'Email 或 Password 錯誤。'))
            }
            // 通過檢查，回傳使用者
            return done(null, user)
          })
      })
      .catch(error => done(error, false))
  }))

  //------------------------------------------------
  // 2. Strategy : FacebookStrategy( {設定}, 驗證func)
  passport.use(new FacebookStrategy({
    // 設定
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK,
    profileFields: ['email', 'displayName']

  }, (accessToken, refreshToken, profile, done) => {
    //使用fb在callback回傳來的資料  
    const { name, email } = profile._json

    // 找使用者
    User.findOne({ email })
      .then(user => {
        // 找到使用者就登入成功，回傳使用者到req.user
        if (user) return done(null, user)

        // 找不到使用者就做一個使用者資料
        // 先做一個密碼
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))
}

// 以下沒有包在 exports 裡面 >>>

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