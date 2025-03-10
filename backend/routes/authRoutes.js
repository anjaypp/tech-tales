// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('../db/connection');
const authModel = require('../models/userModel');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await authModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with role included
        const payload = { id: user._id, username: user.username, role: user.role };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', authToken, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role = 'user' } = req.body;

        // Check if user already exists
        const existingUser = await authModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) { // Fixed the condition
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new authModel({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
