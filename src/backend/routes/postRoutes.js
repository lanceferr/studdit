const express = require('express');
const { createPost, getAllPosts, getPostById, updatePost, deletePost, likePost, addComment } = require('../controllers/postController');
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');

const router = express.Router();

router.post('/', cookieJwtAuth, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', cookieJwtAuth, updatePost);
router.delete('/:id', cookieJwtAuth, deletePost);
router.put('/:id/like', likePost);
router.post('/:id/comments', addComment);

module.exports = router;
