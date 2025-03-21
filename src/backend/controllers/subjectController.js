const Subject = require('../models/subjects');
const Post = require('../models/posts');

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('posts');
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('posts');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new subject
const createSubject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const subject = new Subject({ name, description });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a subject
const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectByNameWithPosts = async (req, res) => {
  try {
    const subject = await Subject.findOne({ name: new RegExp('^' + req.params.name + '$', 'i') }).lean();
    if (!subject) return res.status(404).send('Subject not found');

    const posts = await Post.find({ subject: subject._id })
      .populate('author', 'username')
      .populate('subject', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      })
      .lean();

    res.render('subject', { subject, posts });
  } catch (error) {
    console.error('Error loading subject page:', error);
    res.status(500).send('Server error');
  }
};


module.exports = { 
  getSubjects, 
  getSubjectById, 
  createSubject, 
  updateSubject, 
  deleteSubject, 
  getSubjectByNameWithPosts 
};
