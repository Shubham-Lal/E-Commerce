const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    _id: { type: String, ref: 'User', required: true },
    products: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }]
})

module.exports = mongoose.model('Cart', CartSchema)