const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thread', threadSchema);
