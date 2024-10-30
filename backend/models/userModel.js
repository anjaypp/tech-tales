const mongoose = require("mongoose");
;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required : true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'regular', 'premium'],
        default: 'regular'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    profile: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

