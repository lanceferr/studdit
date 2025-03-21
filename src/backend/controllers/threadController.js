const Thread = require('../models/threads');
const Comment = require('../models/comments');


exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate('author', 'username').populate('subject', 'name');
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching threads', error });
    }
};

exports.getThreadById = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id)
            .populate('author', 'username')
            .populate('subject', 'name')
            .lean();

        if (!thread) return res.status(404).send('Thread not found');

        const comments = await Comment.find({ post: thread._id })
            .populate('author', 'username')
            .lean();

        // Manually attach comments to thread so the template can loop over them
        thread.comments = comments;

        res.render('thread', { posts: [thread] }); // thread.hbs expects an array of posts
    } catch (error) {
        console.error('Error fetching thread:', error);
        res.status(500).send('Error loading thread');
    }
};

exports.createThread = async (req, res) => {
    try {
        const { title, subject, content } = req.body;
        const userId = req.user?._id; // Prevent potential undefined errors

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Ensure the subject exists
        const subjectData = await Subject.findOne({ name: subject });
        if (!subjectData) return res.status(400).json({ message: "Invalid subject" });

        // Create new thread
        const newThread = new Thread({
            title,
            subject: subjectData._id, // Store subject ID
            content,
            author: userId
        });

        await newThread.save();

        // Ensure 'posts' array exists in Subject before pushing
        if (!subjectData.posts) subjectData.posts = [];
        subjectData.posts.push(newThread._id);
        await subjectData.save();

        res.status(201).json({ message: "Thread created successfully", thread: newThread });
    } catch (error) {
        res.status(500).json({ 
            message: "Error creating thread", 
            error: error.message 
        });        
    }
};