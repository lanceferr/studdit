const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [{
        content: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;