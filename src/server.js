const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cors = require("cors");
const path = require('path');
require('dotenv').config(); // Load environment variables

const Post = require('./backend/models/posts');
const Subject = require('./backend/models/subjects'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set Handlebars as the view engine
app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        defaultLayout: false, // No main layout
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'frontend')); // Corrected views directory

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'frontend')));
app.use("/uploads", express.static("uploads"));

// Define frontend routes
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .populate('comments')
            .lean();

        const subjects = await Subject.find().lean();

        res.render('studdit-main', { posts, subjects });
    } catch (err) {
        console.error('Error loading homepage:', err);
        res.status(500).send('Error loading homepage');
    }
});
app.get('/subjects', (req, res) => res.render('subject'));
app.get('/create-thread', async (req, res) => {
    try {
        const subjects = await Subject.find();
        const safeSubjects = subjects.map(s => ({
            id: s._id,
            name: s.name,
            description: s.description
        }));
        res.render('create-thread', { subjects: safeSubjects });
    } catch (error) {
        console.error('Error loading subjects:', error);
        res.status(500).send('Error loading subjects');
    }
});

app.get('/login', (req, res) => res.render('login'));
app.get('/profile', (req, res) => res.render('profile'));
app.get('/register', (req, res) => res.render('register'));
app.get('/thread', (req, res) => res.render('thread')); // Added missing route

// Import and use API routes
const postRoutes = require('./backend/routes/postRoutes');
const commentRoutes = require('./backend/routes/commentRoutes');
const subjectRoutes = require('./backend/routes/subjectRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const threadRoutes = require('./backend/routes/threadRoutes');


app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/subjects', subjectRoutes);
app.use('/users', userRoutes);
app.use('/threads', threadRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.8zbk4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});