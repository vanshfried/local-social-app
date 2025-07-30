const express = require('express');
const Post = require('../models/Post');
const protect = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Public - Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Protected - Create a post with media
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, content, community } = req.body;

      const images = req.files['images']?.map((file) => `/uploads/${file.filename}`);
      const video = req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;

      const post = new Post({
        title,
        content,
        images,
        video,
        community: community || 'India',
        author: req.user._id,
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating post' });
    }
  }
);

module.exports = router;
