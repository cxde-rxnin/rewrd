const express = require('express');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    // Fetch users sorted by XP in descending order
    const leaderboard = await User.find()
      .sort({ xp: -1 }) // Sort by XP in descending order
      .select('telegramId userName xp') // Only include necessary fields
      .limit(10); // Limit to top 10 users

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
