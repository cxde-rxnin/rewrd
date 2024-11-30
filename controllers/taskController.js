const Task = require("../models/task"); // Import Task model
const User = require("../models/user"); // Import User model
const mongoose = require("mongoose");

// Create a new task
const createTask = async (req, res) => {
  const { title, link, xp } = req.body;

  console.log("Request body:", req.body); // Add this line to log the request body

  try {
    if (!title || !link || typeof xp !== "number") {
      return res.status(400).json({ message: "Missing required task fields" });
    }

    const task = new Task({ title, link, xp });
    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.status(200).json(tasks); // Return the list of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark a task as completed
const completeTask = async (req, res) => {
  const { taskId, telegramId } = req.body;
  console.log('Received taskId:', taskId);
  console.log('Received telegramId:', telegramId);

  try {
    // Validate taskId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    // Find user by telegramId
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find task by taskId
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task has XP value (default to 0 if undefined)
    const taskXP = task.xp || 0;
    const userXP = user.xp || 0;

    // Update user's XP and tasksCompleted count
    user.xp = userXP + taskXP;
    user.tasksCompleted = (user.tasksCompleted || 0) + 1;

    // Save user updates
    await user.save();

    // Add user to task's completedBy array
    task.completedBy.push(user._id);
    await task.save();

    res.status(200).json({ message: 'Task completed successfully', user });
  } catch (error) {
    console.error('Error completing task:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = { createTask, getTasks, completeTask }; // Export controller functions
