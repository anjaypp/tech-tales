const express = require("express");
const router = express.Router();
const blogModel = require("../models/blogModel");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const roleCheck = require("../middlewares/roleMiddleware");
const optionalAuth = require("../middlewares/optionalAuthMiddleware");


router.get("/home", optionalAuth, async (req, res) => {
  try {
    // Capture the search term from the query
    const search = req.query.search?.trim() || "";

    // Set a base query for all roles
    let query = { status: "active" };


    // Add search filter if a search term is provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { categories: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch blogs with the constructed query
    const limit = req.user ? (req.user.role === "premium" ? 1000 : 15) : 15;
    const blogs = await blogModel.find(query).limit(limit).populate("authorId");

    // Add image URLs to the response
    const blogsWithImageUrl = blogs.map((blog) => ({
      ...blog.toObject(),
      image: blog.image || null,
    }));

    return res.json(blogsWithImageUrl);
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).json({ message: err.message });
  }
});


//GET Route - Display a specific blog
router.get("/post/:id", optionalAuth, async (req, res) => {
  try {
      const blog = await blogModel.findById(req.params.id).populate("authorId");

      if (!blog || blog.status === "blocked") {
          return res.status(404).json({ message: "Blog not found or blocked by administrator" });
      }

      const blogwithImageUrl = {
        ...blog.toObject(),
        image: blog.image ? `http://localhost:4000/uploads/${blog.image}` : null
      };
    
      res.json(blogwithImageUrl); //Send the blog as the response
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// POST Operation - Create a new blog
router.post("/add", auth, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      categories,
      tags,
      isDraft,
    } = req.body;
    
    // Ensure categories are provided
    if (!title || !summary || !content || !categories) {
      return res
        .status(400)
        .json({ message: "Title, summary, content, and category are required" });
    }

    // If categories is a string, convert it into an array (if necessary)
    const categoriesArray = typeof categories === 'string' ? categories.split(',').map(category => category.trim()) : categories;

    // Handle tags if they are in a string format
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;

    // Create a new blog document
    const newBlog = new blogModel({
      title,
      summary,
      content,
      categories: categoriesArray,
      tags: tagsArray,
      isDraft,
      isPremium,
      image: req.file ? req.file.filename : null,
      authorId: req.user.id
    });

    await newBlog.save();  // Save the blog post
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: error.message });
  }
});


// PUT Operation - Update blog (Only the author or admin)
router.put("/update/:id", auth, async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author or an admin
    if (blog.authorId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update blog fields
    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE Operation - Delete blog (Only the author or admin)
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user is the author or an admin
    if (blog.authorId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.remove();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Block or unblock a blog
router.put("/block/:id", auth, roleCheck("admin"), async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    } else {
      //Toggle blog status
      blog.status = blog.status === "active" ? "blocked" : "active";
      await blog.save();

      return res
        .status(200)
        .json({ message: `Blog ${blog.status} successfully` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


