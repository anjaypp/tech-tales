const mongoose = require("mongoose");

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
        enum: ['admin', 'user'],
        default: 'user'
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
    },
    status: { 
        type: String, 
        enum: ["active", "blocked"], 
        default: "active" },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

