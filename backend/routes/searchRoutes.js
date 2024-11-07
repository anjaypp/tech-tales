const express = require("express");
const router = express.Router();
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const auth = require("../middlewares/authMiddleware");

// Search posts 
router.get("/posts", async (req, res) => {
    const query = req.query.q;
    try {
        const results = await blogModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { body: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } }
            ]
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search users
router.get("/users", auth, async (req, res) => {
    const query = req.query.q;
    try {
        const results = await userModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
