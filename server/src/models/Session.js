const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    _id: { type: String, ref: 'User', required: true },
    login: [{
        timestamp: { type: Date, required: true },
        ip: { type: String }
    }],
    logout: [{
        timestamp: { type: Date },
        ip: { type: String }
    }]
})

module.exports = mongoose.model('Session', SessionSchema)