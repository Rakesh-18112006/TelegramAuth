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
    const { hash, ...authData } = req.query;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
        return res.status(500).json({ error: "Bot token is missing" });
    }

    // Compute the correct secret key
    const secretKey = crypto.createHmac("sha256", Buffer.from(botToken, "utf-8")).digest();

    // Create a sorted verification string
    const checkString = Object.keys(authData)
        .sort()
        .map((key) => `${key}=${authData[key]}`)
        .join("\n");

    // Generate the hash signature
    const computedHash = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

    if (computedHash !== hash) {
        return res.status(401).json({ error: "Unauthorized access - Invalid Hash" });
    }

    res.json({ message: "Login Successful!", user: authData });
});

// Root route for checking server status
app.get("/", (req, res) => {
    res.send("Telegram Auth Server Running ✅");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
