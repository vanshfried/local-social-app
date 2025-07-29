const express = require('express');
const Post = require('../models/Post');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Public - Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Protected - Create a post
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, community } = req.body;

    const post = new Post({
      title,
      content,
      community: community || 'India',
      author: req.user._id
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

module.exports = router;
