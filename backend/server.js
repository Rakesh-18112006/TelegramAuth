const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: "GET,POST" }));

// Telegram Auth Route - Handles GET requests from the Telegram widget
app.get("/auth", (req, res) => {
  // Telegram sends the auth data as query parameters.
  // Extract the 'hash' parameter and the rest of the data.
  const { hash, ...authData } = req.query;
  console.log("Received authData:", authData);
  console.log("Received hash:", hash);

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    console.error("Bot token is missing in environment variables.");
    return res.status(500).json({ error: "Bot token is missing" });
  }

  // According to Telegram’s docs, compute the secret key as:
  // secret_key = SHA256(bot_token)
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  console.log("Computed secretKey (hex):", secretKey.toString("hex"));

  // Build the data_check_string:
  // Sort all keys of authData in alphabetical order and join them in "key=value" lines.
  const sortedKeys = Object.keys(authData).sort();
  const dataCheckString = sortedKeys.map(key => `${key}=${authData[key]}`).join("\n");
  console.log("Data check string:", dataCheckString);

  // Compute the HMAC SHA256 of the data_check_string using the secret key.
  const computedHash = crypto.createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
  console.log("Computed hash:", computedHash);

  // Compare the computed hash with the hash provided by Telegram.
  if (computedHash !== hash) {
    console.error("Hash mismatch! Expected:", hash, "but computed:", computedHash);
    return res.status(401).json({ error: "Unauthorized access - Invalid Hash" });
  }

  // If everything matches, authentication is successful.
  res.json({ message: "Login Successful!", user: authData });
});

// Simple root route to check server status.
app.get("/", (req, res) => {
  res.send("Telegram Auth Server Running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
