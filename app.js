if (process.env.DOT_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express')
require('./config/mongoose')


const app = express()
const PORT = process.env.PORT


app.get('/', (req, res)=> {
  res.send('Hello world!')
})


app.listen(PORT, ()=>{
  console.log(`server is live on http://localhost:${PORT}`)
})