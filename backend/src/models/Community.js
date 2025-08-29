const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // e.g. "India", "J&K", "Jammu"
  },
  description: {
    type: String,
    default: ""
  },
  memberCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Community', communitySchema);
