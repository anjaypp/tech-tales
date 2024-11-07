const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const likeModel = require("../models/likeModel");
const commentModel = require("../models/commentModel");
const bookmarkModel = require("../models/bookmarkModel")

//Like a post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const like = new likeModel({postId: req.params.id});
    await like.save();
    res.status(201).json({ message: "Like added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Remove like
router.delete("/:id/like", auth, async (req, res) => {
  try {
    const like = await likeModel.findByIdAndDelete(req.params.id);
    if (!like) {
      return res.status(404).send("Like not found");
    }
    res.status(200).json({ message: "Like removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Add comment
router.post("/post/:id/comment", auth, async (req, res) => {
  try {
    const comment = new commentModel({postId: req.params.id, ...req.body});
    await comment.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Remove comment
router.delete("/:id/comment", auth, async (req, res) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get post comments
router.get("/post/:id/comments" , auth, async (req,res) => {
    try{
        const comments = await commentModel.find({postId: req.params.id});
        res.json(comments)
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
}) 

// Bookmark a post
router.post("/post/:id/bookmark", auth, async (req, res) => {
    try {
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
      const bookmark = new bookmarkModel.findOneAndDelete({ postId: req.params.id, userId: req.user.id });
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