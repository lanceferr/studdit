const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');

router.post('/',cookieJwtAuth, commentController.createComment);
router.get('/post/:postId', commentController.getCommentsByPost);
router.get('/:id', commentController.getCommentById);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;