// controllers/userController.js
const User = require('../models/User'); // Import the User model

// Create a new user
const createUser = async (req, res) => {
  const { telegramId, userName } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ telegramId });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ telegramId, userName });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch user details by telegramId
const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser, getUser }; // Export controller functions
