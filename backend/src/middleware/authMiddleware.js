const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next(); // ✅ Exit here after success
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  // Only runs if NO token header
  return res.status(401).json({ message: 'No token, not authorized' });
};

module.exports = protect;
