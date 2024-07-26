const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date },
    ipAddress: { type: String }
})

module.exports = mongoose.model('Session', SessionSchema)