const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.BOT_TOKEN; // Store your bot token in .env

app.use(cors());
app.use(express.json());

// Telegram Authentication Route
app.post("/auth", (req, res) => {
  const { hash, ...userData } = req.body;

  if (!BOT_TOKEN) {
    return res.status(500).json({ error: "Bot token is missing!" });
  }

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();

  const checkString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");

  const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  if (hmac !== hash) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  res.json({ message: "Login Successful!", user: userData });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
