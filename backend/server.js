const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Telegram Auth Route
app.post("/auth", (req, res) => {
    const { hash, ...data } = req.body;
    const botToken = process.env.BOT_TOKEN; // Securely store your bot token in .env

    if (!botToken) {
        return res.status(500).json({ error: "Bot token is missing in server config" });
    }

    // 1️⃣ Compute secret key
    const secretKey = crypto.createHmac("sha256", botToken).update("WebAppData").digest();

    // 2️⃣ Create a verification string
    const checkString = Object.keys(data)
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join("\n");

    // 3️⃣ Generate HMAC signature
    const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

    // 4️⃣ Verify authentication
    if (hmac !== hash) {
        return res.status(401).json({ error: "Unauthorized access - Invalid Hash" });
    }

    res.json({ message: "Login Successful!", user: data });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
