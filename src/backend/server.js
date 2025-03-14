// server.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users'); // Import the User model
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@testapi.8zbk4.mongodb.net/Node-API?retryWrites=true&w=majority&appName=TestAPI')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/subjects', subjectRoutes);
app.use('/users', userRoutes);

// Example route to fetch a user profile
app.get('/api/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body); // Create a new user from the request body
        await newUser.save(); // Save the user to the database
        res.status(201).send(newUser); // Send the created user as a response
    } catch (err) {
        res.status(400).send(err); // Handle errors
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});