const express = require('express');
const authenticateToken = require('../middleware/authMiddleware'); // Import authentication middleware
const User = require('../models/User'); // Import User model

const router = express.Router();

// Route to get logged-in user's information
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send back user details
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
