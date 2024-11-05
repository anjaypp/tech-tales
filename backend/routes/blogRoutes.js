const express = require('express');
const router = express.Router();
const blogModel = require('../models/blogModel');
const auth = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleMiddleware');

// GET Operation - Display all active blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await blogModel.find({ status: 'active' }); // Exclude blocked blogs
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Operation - Create a new blog (Authenticated users only)
router.post('/add', auth, async (req, res) => {
    const { title, content, categories, tags, isDraft, isPremium, image } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        const blog = new blogModel({
            ...req.body,
            authorId: req.user.id, // Set author as the current authenticated user
        });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT Operation - Update blog (Only the author or admin)
router.put('/update/:id', auth, async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the user is the author or an admin
        if (blog.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update blog fields
        const updatedBlog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE Operation - Delete blog (Only the author or admin)
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the user is the author or an admin
        if (blog.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Block or unblock a blog
router.put('/block/id:', auth, roleCheck('admin'), async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if(!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        else {
            //Toggle blog status
            blog.status = blog.status === 'active' ? 'blocked' : 'active';
            await blog.save();

            return res.status(200).json({ message: `Blog ${blog.status} successfully` });
        }
    }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
})

module.exports = router;
