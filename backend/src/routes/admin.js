const express = require("express");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Post = require("../models/Post");

const router = express.Router();

// DELETE user + their posts + media
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find posts by this user
    const posts = await Post.find({ author: userId });

    // Delete media files
    posts.forEach((post) => {
      if (post.images && post.images.length > 0) {
        post.images.forEach((img) => {
          const imgPath = path.join(__dirname, "../../", img.startsWith("/") ? img.slice(1) : img);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
            console.log(`🗑️ Deleted image: ${imgPath}`);
          }
        });
      }
      if (post.video) {
        const videoPath = path.join(__dirname, "../../", post.video.startsWith("/") ? post.video.slice(1) : post.video);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
          console.log(`🗑️ Deleted video: ${videoPath}`);
        }
      }
    });

    // Delete posts
    await Post.deleteMany({ author: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: "✅ User and all related posts deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
