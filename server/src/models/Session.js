const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    user_id: { type: String, ref: 'User', required: true, unique: true },
    login: [{
        timestamp: { type: Date, required: true },
        ip: { type: String, required: true }
    }],
    logout: [{
        timestamp: { type: Date },
        ip: { type: String }
    }]
})

module.exports = mongoose.model('Session', SessionSchema)