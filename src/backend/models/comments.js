const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
    date: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true } // Reference to Post
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
