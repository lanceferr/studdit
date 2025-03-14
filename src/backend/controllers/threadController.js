const Thread = require('../models/threads');

exports.createThread = async (req, res) => {
    try {
        const { title, subject, content } = req.body;
        const newThread = new Thread({ title, subject, content });
        await newThread.save();
        res.status(201).json({ message: 'Thread created successfully', thread: newThread });
    } catch (error) {
        res.status(500).json({ message: 'Error creating thread', error });
    }
};

exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find();
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
