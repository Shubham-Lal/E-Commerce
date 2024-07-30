const express = require('express')
const router = express.Router()
const controller = require('./controllers.js')
const verifyToken = require('./jwt.js')

router.get('/', (_, res) => res.send('Server running'))

router.post('/register', controller.createUser)

router.post('/login', controller.verifyUser)

router.get('/demo/admin', controller.demoAdmin)

router.get('/demo/user', controller.demoUser)

router.post('/products', verifyToken, controller.createProduct)

router.get('/products', controller.fetchProducts)

router.put('/products/:id', verifyToken, controller.updateProduct)

router.delete('/products/:id', verifyToken, controller.deleteProduct)

router.post('/cart', controller.updateCart)

router.get('/cart', controller.fetchCart)

router.post('/orders', verifyToken, controller.checkoutProduct)

router.get('/orders', verifyToken, controller.fetchOrders)

router.get('/sessions', verifyToken, controller.fetchSessions)

router.get('/payment', controller.processPayment)

module.exports = router