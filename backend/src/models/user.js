const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Post = require("./Post"); // Import Post model

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profileType: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community", // Reference to communities user joined
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete posts when a user is deleted
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const userId = this.getQuery()["_id"];
    await Post.deleteMany({ author: userId }); // Deletes all posts from this user
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
