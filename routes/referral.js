const express = require('express');
const User = require('../models/user');  // Import User model

const router = express.Router();

// Refer a new user
router.post('/refer', async (req, res) => {
  const { telegramId, referredTelegramId } = req.body;

  try {
    // Check if the referrer exists
    const referrer = await User.findOne({ telegramId });
    if (!referrer) {
      return res.status(404).json({ message: 'Referrer not found' });
    }

    // Check if the referred user exists
    const referredUser = await User.findOne({ telegramId: referredTelegramId });
    if (referredUser) {
      return res.status(400).json({ message: 'This user is already registered' });
    }

    // Create the new user with the referrer information
    const newUser = new User({
      telegramId: referredTelegramId,
      referredBy: referrer.telegramId, // Store referrer’s telegramId
    });

    // Save the new user to the database
    await newUser.save();

    // Update referrer's referral count
    referrer.referralCount += 1;
    await referrer.save();

    // Optionally, you can reward the referrer and the referred user with XP or Ton here
    // Example: referrer.xp += 10; referredUser.xp += 5;

    res.status(201).json({ message: 'User referred successfully' });
  } catch (error) {
    console.error('Error referring user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get referrals of a user
router.get('/referrals/:telegramId', async (req, res) => {
  const { telegramId } = req.params;

  try {
    // Find the user and their referrals
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find users referred by this user
    const referrals = await User.find({ referredBy: telegramId });
    res.status(200).json({ referrals });
  } catch (error) {
    console.error('Error fetching referrals:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
