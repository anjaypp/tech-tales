const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/roleMiddleware");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");

//Get all users
router.get("/users", auth, roleCheck("admin"), async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/delete/user/:id", auth, roleCheck("admin"), async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get("/posts", auth, roleCheck("admin"), async (req, res) => {
  try {
    const posts = await blogModel.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post
router.delete("delete/post/id:", auth, roleCheck("admin"), async (req, res) => {
  try {
    const post = await blogModel.findByIdAndDelete(req.params.id);
    if (!post) {
      return res(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update user role
router.put("update/user/:id", auth, roleCheck("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await userModel.findByIdAndUpdate(req.params.id, {role},{new:true});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
