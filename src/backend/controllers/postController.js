const Post = require('../models/posts');
const Subject = require('../models/subjects'); // Import the Subject model
const jwt = require('jsonwebtoken');

const createPost = async (req, res) => {
    try {
        const { title, content, subject } = req.body;
        const author = req.user.userId // Get the author ID from the JWT token

        const post = new Post({ title, content, subject, author });
        await post.save();

        // Push the post ID to the subject's posts array
        const subjData = await Subject.findById(subject);
        if (!subjData) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        subjData.posts.push(post._id);
        await subjData.save();


        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const getAllPosts = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments');
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const likePost = async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      res.status(200).json({ likes: post.likes });
    } catch (err) {
      console.error("Error liking post:", err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.comments.push(req.body);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getPostView = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('subject', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            })
            .lean();

        if (!post) return res.status(404).send("Post not found");

        res.render("thread", { posts: [post] });
    } catch (error) {
        console.error("Error rendering thread:", error);
        res.status(500).send("Server error");
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    addComment,
    getPostView
};