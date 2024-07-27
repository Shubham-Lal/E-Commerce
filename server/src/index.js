require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const controller = require('./controller.js')

const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (_, res) => res.send('Server running'))
app.post('/register', controller.createUser)
app.post('/login', controller.verifyUser)
app.post('/products', controller.createProduct)
app.get('/products', controller.fetchProducts)
app.put('/products/:id', controller.updateProduct)
app.delete('/products/:id', controller.deleteProduct)
app.post('/cart', controller.updateCart)
app.get('/cart', controller.fetchCart)
app.post('/orders', controller.createOrder)
app.get('/orders', controller.fetchOrders)
app.get('/sessions', controller.fetchSessions)
app.post('/payment', controller.processPayment)

const PORT = process.env.PORT || 8000
mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Listening for requests on port: ${PORT}`)))
    .catch(err => console.log(`MongoDB connection error: ${err}`))