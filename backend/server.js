const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors()); // Allow all origins (adjust for production security)

// ✅ Content Security Policy (CSP) to allow Telegram OAuth
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://oauth.telegram.org;");
  next();
});

// ✅ Environment Variables
const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// ✅ Verify Telegram OAuth Login
app.post("/auth", async (req, res) => {
  try {
    const authData = req.body;

    if (!authData.hash) {
      return res.status(400).json({ error: "Missing hash parameter" });
    }

    console.log("Received Auth Data:", authData);

    const secretKey = crypto.createHash("sha256").update(TELEGRAM_BOT_TOKEN).digest();
    const sortedData = Object.keys(authData)
      .filter((key) => key !== "hash")
      .sort()
      .map((key) => `${key}=${authData[key]}`)
      .join("\n");

    const computedHash = crypto.createHmac("sha256", secretKey).update(sortedData).digest("hex");

    console.log("Received Hash:", authData.hash);
    console.log("Computed Hash:", computedHash);

    if (authData.hash !== computedHash) {
      return res.status(401).json({ error: "Invalid authentication data" });
    }

    // ✅ Send a welcome message to the user
    const userId = authData.id;
    const messageText = `Hello ${authData.first_name}, welcome to our Telegram Auth system! 🎉`;

    await sendMessage(userId, messageText);

    res.json({ success: true, user: authData });
  } catch (error) {
    console.error("Error in authentication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Function to send messages to Telegram users
const sendMessage = async (userId, text) => {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: userId,
      text: text,
    });

    console.log("Message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response ? error.response.data : error.message);
    throw new Error("Failed to send message");
  }
};

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
