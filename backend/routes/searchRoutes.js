const express = require("express");
const router = express.Router();
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const optionalAuth = require("../middlewares/optionalAuthMiddleware");

// Search posts 
router.get("/search", optionalAuth, async(req, res) => {
    try {
        const searchQuery = req.query.query?.trim() || "";
        
        // Base query including status check
        let searchConditions = {
            status: "active"
        };

        // Handle premium content access
        if (!req.user || req.user.role !== "premium") {
            searchConditions.isPremium = false;
        }

        // Add search criteria if query exists
        if (searchQuery) {
            searchConditions.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { summary: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
                { categories: { $regex: searchQuery, $options: "i" } }
            ];
        }

        // Apply appropriate limit based on user role
        const limit = req.user?.role === "premium" ? 1000 : 15;

        const blogs = await blogModel
            .find(searchConditions)
            .limit(limit)
            .populate("authorId");

        // Add image URLs to response
        const blogsWithImageUrl = blogs.map(blog => ({
            ...blog.toObject(),
            image: blog.image || null
        }));

        if (!blogs.length) {
            return res.status(404).json({
                message: "No blogs found matching your search."
            });
        }

        res.json(blogsWithImageUrl);    
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            message: "Error occurred while searching"
        });
    }
});

module.exports = router;
