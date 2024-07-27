const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user_id: { type: String, ref: 'User', required: true },
    products: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    total_amount: { type: Number, required: true },
    order_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)