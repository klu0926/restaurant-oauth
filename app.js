if (process.env.DOT_ENV !== 'production'){
  require('dotenv').config()
}

require('./config/mongoose')
const express = require('express')
const routes = require('./routes')


const app = express()
const PORT = process.env.PORT


app.use(routes)


app.listen(PORT, ()=>{
  console.log(`server is live on http://localhost:${PORT}`)
})