const express = require("express");
const router = express.Router();
const Community = require("../models/community");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware"); // auth middleware
const jwt = require("jsonwebtoken");

// GET all communities
router.get("/", async (req, res) => {
  try {
    const communities = await Community.find();

    let enriched = communities.map((comm) => ({
      ...comm.toObject(),
      joined: false,
    }));

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.communities) {
          const userCommunityIds = user.communities.map((c) => c.toString());
          enriched = communities.map((comm) => ({
            ...comm.toObject(),
            joined: userCommunityIds.includes(comm._id.toString()),
          }));
        }
      } catch (err) {
        // invalid token → ignore
      }
    }

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// POST join a community
router.post("/:id/join", protect, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    const user = await User.findById(req.user.id);

    if (!user.communities) user.communities = [];

    // Already joined → return joined = true
    if (user.communities.includes(community._id)) {
      return res.json({
        message: "Already joined",
        joined: true,
        memberCount: community.memberCount,
      });
    }

    // New join
    user.communities.push(community._id);
    await user.save();

    community.memberCount = (community.memberCount || 0) + 1;
    await community.save();

    res.json({
      message: `Joined ${community.name}`,
      joined: true,
      memberCount: community.memberCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
