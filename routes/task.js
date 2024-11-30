// routes/task.js
const express = require('express');
const router = express.Router();
const { createTask, getTasks, completeTask } = require('../controllers/taskController'); // Import controller

// POST route to create a new task
router.post('/create', createTask);

// GET route to get all tasks
router.get('/', getTasks);

// PUT route to mark a task as completed
router.put('/complete', completeTask);


module.exports = router;  // Export the router
