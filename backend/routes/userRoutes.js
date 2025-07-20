const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

router.post('/register', asyncHandler(async (req, res) => {
    const { email ,username, password } = req.body;

    if (!username || !password || !email) {
        res.status(400);
        throw new Error('Please enter all fields (username and password)');
    }

    const userExists = await User.findOne({ username });
    console.log('Checking if user exists:', username, userExists);
    if (userExists) {
        res.status(400);
        throw new Error('User with that username already exists');
    }

    const user = await User.create({
        username,
        password,
        email
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data provided');
    }
}));

router.post('/test-insert', async (req, res) => {
    try {
        const user = new User({ username: 'testuser', password: 'testpassword123' });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    return res.status(200).json({
        message: 'Login successful',
        username: username,
    })
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
}));

module.exports = router;