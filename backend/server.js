const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Telegram Auth Route (Handles both GET and POST)
app.all("/auth", (req, res) => {
    const data = req.method === "POST" ? req.body : req.query;
    const { hash, ...authData } = data;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
        return res.status(500).json({ error: "Bot token is missing in server config" });
    }

    // Compute secret key
    const secretKey = crypto.createHmac("sha256", botToken).update("WebAppData").digest();

    // Create verification string
    const checkString = Object.keys(authData)
        .sort()
        .map((key) => `${key}=${authData[key]}`)
        .join("\n");

    // Generate HMAC signature
    const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

    // Verify authentication
    if (hmac !== hash) {
        return res.status(401).json({ error: "Unauthorized access - Invalid Hash" });
    }

    res.json({ message: "Login Successful!", user: authData });
});

// Root route to check server status
app.get("/", (req, res) => {
    res.send("Telegram Auth Server is Running ✅");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
