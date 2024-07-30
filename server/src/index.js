require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes.js')

const app = express()

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = process.env.PORT || 8000
mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Listening for requests on port: ${PORT}`)))
    .catch(err => console.log(`MongoDB connection error: ${err}`))

app.use('/', routes)