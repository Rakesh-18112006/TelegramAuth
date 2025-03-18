const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors()); // Allow all origins (adjust for security in production)

// ✅ Content Security Policy (CSP) to allow Telegram OAuth
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://oauth.telegram.org;");
  next();
});

// Your Telegram bot token (keep it secret!)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ✅ Verify Telegram OAuth Login
app.get("/auth", (req, res) => {
  const authData = req.query;

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

  res.json({ success: true, user: authData });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
