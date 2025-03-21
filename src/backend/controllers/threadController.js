const Thread = require('../models/threads');


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
        const thread = await Thread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });
        res.status(200).json(thread);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching thread', error });
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