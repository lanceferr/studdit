const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Comment' }], // Reference to the Comment model :3
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
