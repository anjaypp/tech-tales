const express = require("express");
const router = express.Router();
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const auth = require("../middlewares/authMiddleware");

// Make a post premium
router.post("/posts/:id/premium", auth, async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    } else {
      blog.isPremium = true;
      await blog.save();
      res.status(200).json({ message: "Blog made premium and saved successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all premium posts
router.get("/posts", auth, async (req, res) => {
  try {
    // Check if user has a premium subscription
    if (!req.user.isPremium) {
      return res.status(403).json({ message: "You must have a premium subscription to view this content" });
    }

    const premiumPosts = await blogModel.find({ isPremium: true });
    res.json(premiumPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a premium subscription
router.post("/subscription", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    // Check if user already has a premium subscription
    if (user.isPremium) {
      return res.status(400).json({ message: "You already have a premium subscription" });
    }

    user.isPremium = true;
    await user.save();
    res.status(200).json({ message: "Subscription created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check subscription status
router.get("/subscription/status", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({ isPremium: user.isPremium });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
