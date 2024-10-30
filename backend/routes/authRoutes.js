const express = require('express');
const router = express.Router();
const authModel = require('../models/userModel');

router.post('/login', async(req, res) => {
    try {
        const user= await authModel.findOne({username: req.body.username, password: req.body.password});
        if(!user){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        res.status(200).json({message: 'Login successful'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/register', async(req, res) => {
    try {
        const user = new authModel(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    } 
});

module.exports = router