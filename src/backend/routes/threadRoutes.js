const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');

router.post('/', threadController.createThread);
router.get('/', threadController.getAllThreads);
router.get('/:id', threadController.getThreadById);

module.exports = router;
