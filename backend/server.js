const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Root route to confirm the server is running
app.get("/", (req, res) => {
    res.send("Telegram Auth Server Running ✅");
});

// ✅ Telegram Auth Route
app.get("/auth", (req, res) => {
    const { hash, ...authData } = req.query;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
        return res.status(500).json({ error: "Bot token is missing" });
    }

    // Create a sorted verification string
    const checkString = Object.keys(authData)
        .sort()
        .map((key) => `${key}=${authData[key]}`)
        .join("\n");

    // Generate the hash signature using botToken as the key
    const hmac = crypto.createHmac("sha256", Buffer.from(botToken, "utf-8"));
    hmac.update(checkString);
    const computedHash = hmac.digest("hex");

    console.log("Received Hash:", hash);
    console.log("Computed Hash:", computedHash);
    console.log("Auth Data:", authData);

    if (computedHash !== hash) {
        return res.status(401).json({ error: "Unauthorized access - Invalid Hash" });
    }

    res.json({ message: "Login Successful!", user: authData });
});

// ✅ Handle Telegram Webhook Route (IMPORTANT)
app.post("/", (req, res) => {
    console.log("Received Telegram Webhook:", req.body);
    res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
