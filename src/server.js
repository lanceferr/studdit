const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cors = require("cors");
const path = require('path');

require('dotenv').config(); // Load environment variables

const cookieParser = require('cookie-parser');
const Post = require('./backend/models/posts');
const postController = require('./backend/controllers/postController');
const Subject = require('./backend/models/subjects'); 
const { cookieJwtAuth } = require('./backend/middleware/cookieJwtAuth');
const {viewAuth} = require('./backend/middleware/viewAuth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(viewAuth); // Middleware to check JWT for views

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
            .populate('subject', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            })
            .lean();

        const subjects = await Subject.find().lean();

        res.render('studdit-main', { posts, subjects });
    } catch (err) {
        console.error('Error loading homepage:', err);
        res.status(500).send('Error loading homepage');
    }
});
app.get('/about', (req, res) => res.render('about'));
app.get('/subjects', (req, res) => res.render('subject'));
app.get('/login', (req, res) => res.render('login'));
app.get('/profile', (req, res) => {res.render('profile')});
app.get('/register', (req, res) => res.render('register'));
app.get('/thread', (req, res) => res.render('thread'));
app.get('/thread/:id', postController.getPostView);
app.get('/:username/create-thread', cookieJwtAuth, async (req, res) => {
    try {

        // Check if the logged-in user is the same as the username in the URL
        if (req.user.username !== req.params.username) {
            return res.status(403).send('Forbidden: You can only access your own thread creation page');
            }
      const subjects = await Subject.find().lean();
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

  app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.redirect('/'); // Redirect to homepage
    });
  

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
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});