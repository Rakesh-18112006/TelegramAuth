const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Telegram Auth Route (GET Request)
app.get("/auth", (req, res) => {
  // Get authentication data from query parameters
  const { hash, ...authData } = req.query;

  console.log("Received authData:", authData);
  console.log("Received hash:", hash);

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    console.error("Bot token is missing");
    return res.status(500).json({ error: "Bot token is missing" });
  }

  // Compute the secret key as the SHA256 hash of the bot token
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  console.log("Computed secretKey (hex):", secretKey.toString("hex"));

  // Create a sorted check string: key1=value1\nkey2=value2\n...
  const sortedKeys = Object.keys(authData).sort();
  const checkString = sortedKeys.map(key => `${key}=${authData[key]}`).join("\n");
  console.log("Check string:", checkString);

  // Compute the HMAC SHA256 of the check string using the secret key
  const computedHash = crypto.createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");
  console.log("Computed hash:", computedHash);

  // Compare the computed hash with the hash received from Telegram
  if (computedHash !== hash) {
    console.error("Hash mismatch! Expected:", hash, "but computed:", computedHash);
    return res.status(401).json({ error: "Unauthorized access - Invalid Hash" });
  }

  res.json({ message: "Login Successful!", user: authData });
});

// Root route for server status check
app.get("/", (req, res) => {
  res.send("Telegram Auth Server Running ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
