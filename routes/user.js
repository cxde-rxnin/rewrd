// routes/user.js
const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controllers/userController'); // Import controller

// POST route to create a new user
router.post('/create-user', createUser);

// GET route to fetch user by telegramId
router.get('/user-info/:telegramId', getUser);

module.exports = router;
