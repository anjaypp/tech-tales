const express = require('express');
const router = express.Router();
const blogModel = require('../models/blogModel');

// GET Operation - Display all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await blogModel.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Operation - Create a new blog
router.post('/add', async (req, res) => {
    try {
        const blog = new blogModel(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT Operation - Update blog
router.put('/update/:id', async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog); // Return the updated blog
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE Operation - Delete blog
router.delete('/delete/:id', async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' }); // Send success message
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
