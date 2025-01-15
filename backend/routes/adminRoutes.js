const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users." });
  }
});

// Delete user
router.delete("/delete/user/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user." });
  }
});

// Get all pending posts
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await blogModel.find({ status: "pending" });
    if (!blogs.length) {
      return res.status(404).json({ message: "No pending posts found" });
    }
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching pending posts:", err);
    res.status(500).json({ message: "Server error while fetching pending posts." });
  }
});

// Backend route for approving a blog post
router.patch('/blog/:id/approve', async (req, res) => {  // Corrected to /blogs path
  const { id } = req.params;

  try {
    const blog = await blogModel.findById(id);
    
    // Only approve if the blog is pending
    if (blog.status === 'pending') {
      blog.status = 'active';  // Update to active status
      await blog.save();
      return res.status(200).json(blog);
    }
    
    return res.status(400).json({ message: 'Blog cannot be approved because it is not pending.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error approving blog', error: err });
  }
});

// Backend route for rejecting a blog post
router.patch('/blog/:id/reject', async (req, res) => {  // Corrected to /blogs path
  const { id } = req.params;

  try {
    const blog = await blogModel.findById(id);
    
    // Only reject if the blog is pending
    if (blog.status === 'pending') {
      blog.status = 'rejected';  // Update to rejected status
      await blog.save();
      return res.status(200).json(blog);
    }
    
    return res.status(400).json({ message: 'Blog cannot be rejected because it is not pending.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error rejecting blog', error: err });
  }
});

// Delete post
router.delete("/delete/blog/:id", async (req, res) => {
  try {
    const post = await blogModel.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error while deleting post." });
  }
});

// Update user role
router.put("/update/user/:id", async (req, res) => {
  const { role } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error while updating user role." });
  }
});

module.exports = router;
