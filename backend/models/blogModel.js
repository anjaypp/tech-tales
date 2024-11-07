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
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
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
    enum: ["active", "blocked"], 
    default: "active" 
}
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
