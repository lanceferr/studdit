const Comment = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const createComment = async (req, res) => {
    try {
        const { content, post } = req.body;
        let author = req.user.userId; // Get the author ID from the JWT token

        const userExists = await User.findById(author);
        const postExists = await Post.findById(post);

        if (!userExists || !postExists) {
            return res.status(404).json({ message: 'User or Post not found' });
        }

        const newComment = new Comment({ content, author, post });
        await newComment.save();

        await Post.findByIdAndUpdate(post, {
            $push: { comments: newComment._id }
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author', 'username');
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const { content } = req.body;

        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author.toString() !== req.user.userID) {
            return res.status(403).json({ message: 'You should probably stick to your own comment' });
        }
        
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true, runValidators: true }
        );
        
        res.json(updatedComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const deletedComment = await Comment.findById(req.params.id);

        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        if (deletedComment.author.toString() !== req.user.userID) {
            return res.status(403).json({ message: 'I dont think so, stick to your own comment' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    getCommentById,
    updateComment,
    deleteComment
};
