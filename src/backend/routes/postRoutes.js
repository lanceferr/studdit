const express = require('express');
const { createPost, getAllPosts, getPostById, updatePost, deletePost, likePost, addComment } = require('../controllers/postController');

const router = express.Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/comments', addComment);

module.exports = router;