const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username }, // include username
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ✅ Signup (returns token for auto-login)
router.post('/signup', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Strong password regex
    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(password)) {
      return res.status(400).json({ message: 'Password too weak' });
    }

    const user = await User.create({ username, password });

    // ✅ Auto-login
    const token = generateToken(user);

    res.status(201).json({ 
      message: 'Signup successful',
      token,
      username: user.username 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login (same structure as signup)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ 
      token, 
      username: user.username 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
