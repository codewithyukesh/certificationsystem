const express = require('express');
const authenticateToken = require('../middleware/authenticateToken'); // Import middleware
const User = require('../models/User');

const router = express.Router();

// Route to get logged-in user's info (username and role)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username role'); // Fetch username and role only

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
