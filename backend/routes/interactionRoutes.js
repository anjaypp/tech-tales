const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const likeModel = require("../models/likeModel");
const commentModel = require("../models/commentModel");
const bookmarkModel = require("../models/bookmarkModel")

// Get like status and count for a post
router.get("/:id/likes", auth, async (req, res) => {
  try {
      const likeCount = await likeModel.countDocuments({ blogId: req.params.id });
      const hasLiked = await likeModel.exists({ blogId: req.params.id, userId: req.user.id });

      res.json({ likeCount, hasLiked });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

//Like a post (Authenticated users only)
router.post("/:id/like", auth, async (req, res) => {
  try {
    //Check if user has already liked the post
    const existingLike = await likeModel.findOne({blogId: req.params.id, userId: req.user.id});
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post" });
    }
    const like = new likeModel({blogId: req.params.id, userId: req.user.id,});
    await like.save();
    res.status(201).json({ message: "Like added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Remove like
router.delete("/:id/like", auth, async (req, res) => {
  try {
    const like = await likeModel.findOneAndDelete({ blogId: req.params.id, userId: req.user.id });
    if (!like) {
      return res.status(404).send("Like not found");
    }
    res.status(200).json({ message: "Like removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a comment to a post
router.post("/:blogId/comment", auth, async (req, res) => {
  try {
    const newComment = new commentModel({
      blogId: req.params.blogId,
      userId: req.user.id,
      content: req.body.content,
    });
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a comment
router.delete("/comment/:commentId", auth, async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow deletion only by the comment author or an admin
    if (comment.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.remove();
    res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all comments for a post
router.get("/:blogId/comments", async (req, res) => {
  try {
    const comments = await commentModel
      .find({ blogId: req.params.blogId }).populate("userId");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bookmark a post
router.post("/post/:id/bookmark", auth, async (req, res) => {
    try {
      const existingBookmark = await bookmarkModel.findOne({ postId: req.params.id, userId: req.user.id})
      if(existingBookmark) {
        return res.status(400).json({message: "Post already bookmarked"});
      }
      
      const bookmark = new bookmarkModel({ postId: req.params.id, userId: req.user.id });
      await bookmark.save();
      res.status(201).json({ message: "Post bookmarked successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Remove bookmark
router.delete("/post/:id/bookmark", auth, async (req, res) => {
    try {
      const bookmark = await bookmarkModel.findOneAndDelete({ blogId: req.params.id, userId: req.user.id });
      if (!bookmark){
        return res.status(404).json({message: "Bookmark not found"});
      }
      res.status(200).json({ message: "Post bookmark removed successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Get user's bookmarks
router.get("/user/:id/bookmarks", auth, async (req, res) => {
  try {
    const bookmarks = await bookmarkModel.find({ userId: req.params.id });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;