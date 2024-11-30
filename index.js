// 1. Load environment variables
require('dotenv').config();

// 2. Import dependencies
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose'); // For MongoDB
const axios = require('axios');
const express = require('express');

// 3. Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string
const API_BASE_URL = process.env.API_BASE_URL;
const PORT = process.env.PORT;

// 4. Check required configurations
if (!BOT_TOKEN || !MONGO_URI) {
  console.error("Error: BOT_TOKEN or MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

// 5. Initialize the bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log("Telegram bot is running...");

// 6. Initialize Express app (optional)
const app = express();
app.use(express.json());

// 7. Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// 8. Define MongoDB schema and model
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// 9. Handle `/start` command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "there";

  try {
    // Save or update user in the database
    const user = await User.findOneAndUpdate(
      { telegramId: chatId },
      {
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        username: msg.from.username,
      },
      { upsert: true, new: true }
    );

    // Send a welcome message
    await bot.sendMessage(chatId, `Hi ${firstName}! Welcome to the app.`);

    // Generate app link with telegramId
    const appUrl = `https://your-app-url.com?telegramId=${chatId}`;
    await bot.sendMessage(chatId, `Access your app here: ${appUrl}`);

    console.log(`User ${user.telegramId} (${user.username || "unknown"}) registered.`);
  } catch (error) {
    console.error("Error handling /start command:", error);
    await bot.sendMessage(chatId, "Something went wrong. Please try again later.");
  }
});

// 10. Handle generic messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Skip if the message is the /start command
  if (msg.text === '/start') return;

  // Reply to any other messages
  await bot.sendMessage(chatId, "I'm here to assist! Use /start to begin.");
});

// 11. Handle errors
bot.on('polling_error', (error) => {
  console.error("Polling error occurred:", error);
});

// 12. Optional: Add Express route
app.get('/', (req, res) => {
  res.send("Bot is running.");
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
