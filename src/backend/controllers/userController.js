const User = require('../models/users');
const Post = require("../models/posts");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { username, password, email, bio, course } = req.body;
        const avatarPath = req.file ? req.file.path : null;

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            bio,
            course,
            avatar: avatarPath
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

const updateUser = async (req, res) => {
    try {
        const { username, password, email, bio, course, avatar } = req.body;
        const updateData = { username, password, email, bio, course, avatar };

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        try{
            bcrypt.compare(req.body.password, user.password);
        }

        catch (error){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // if (user.password !== password) {
        //     return res.status(401).json({ message: "Invalid credentials" });
        // }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        console.log("Fetching profile for:", req.params.username);

        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user);

        // Fetch user's recent posts
        const posts = await Post.find({ author: user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('subject', 'name')
            .populate('subject', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            })
            .lean();


        console.log("Posts found:", posts.length > 0 ? posts : "No posts available");

        res.render("profile", {
            username: user.username,
            email: user.email,
            bio: user.bio,
            course: user.course,
            avatar: user.avatar || "/assets/user-avatar.png",
            posts,
            hasPosts: posts.length > 0
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getUserProfile
};
