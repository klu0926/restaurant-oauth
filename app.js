if (process.env.DOT_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const helper = require('./config/handlebar-helper')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')

// app
const app = express()
const PORT = process.env.PORT

// app view engine
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: helper,
}))
app.set('view engine', 'hbs')

// middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated() // passport 可以偵測是否已經驗證過
  res.locals.user = req.user // passport done(null, user) 傳出來的使用者
  res.locals.success_msg = req.flash('success_msg') // 設定 flash success msg
  res.locals.warning_msg = req.flash('warning_msg') // 設定 flash warning msg
  res.locals.noData = req.flash('noData')
  console.log('noData', res.locals.noData)
  next()
})

// routes
app.use(routes)


app.listen(PORT, () => {
  console.log(`server is live on http://localhost:${PORT}`)
})