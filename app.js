if (process.env.DOT_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const helper = require('./config/handlebar-helper')

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
app.use(express.urlencoded({ extended: true }))

// routes
app.use(routes)


app.listen(PORT, () => {
  console.log(`server is live on http://localhost:${PORT}`)
})