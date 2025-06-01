const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    queryRaised: [{
        type: String,
        trim: true
    }],
    lastActive: {
        type: Date,
        required: true,
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('User', userSchema);