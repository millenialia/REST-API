const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({
  path: './.env'
})

const contactsRouter = require('./routes/api/contacts')

const app = express()

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter) 

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = app
