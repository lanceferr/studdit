const express = require('express');
const { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject, getSubjectByNameWithPosts } = require('../controllers/subjectController');

const router = express.Router();

router.get('/', getSubjects);
router.get('/r/:name', getSubjectByNameWithPosts);
router.get('/:id', getSubjectById);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;