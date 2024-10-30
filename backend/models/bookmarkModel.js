const mongoose  =  require("mongoose");

const bookmarkSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;