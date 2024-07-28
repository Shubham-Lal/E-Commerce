const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [1, 'Price must be greater than 0'] },
    stock: { type: Number, required: true, min: [1, 'Stock must be greater than 0'] }
}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)