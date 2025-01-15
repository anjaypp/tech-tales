const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  categories: {
    type: [String]
  },
  tags: {
    type: [String]
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: { 
    type: String, 
    enum: ["pending", "active", "blocked"], 
    default: "pending",
    index: true 
    }
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
