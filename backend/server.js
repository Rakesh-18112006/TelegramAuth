const express = require("express");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));

// ✅ Fix: Ensure root URL `/` responds
app.get("/", (req, res) => {
    res.send("Telegram Auth Backend is Running!");
});

// ✅ Fix: Correct `/auth` Route
app.get("/auth", (req, res) => {
    const { hash, ...data } = req.query;
    
    // ✅ Fix: Read Bot Token from `.env` for security
    const token = "7339338847:AAEOVoYFUnYUM2ieMI8sXpME-zff-_K-64Q";  
    if (!token) {
        return res.status(500).json({ error: "Bot token not set in environment variables." });
    }

    // ✅ Fix: Correct Secret Key Calculation
    const secretKey = crypto.createHmac("sha256", "WebApp").update(token).digest();
    const checkString = Object.keys(data).sort().map((key) => `${key}=${data[key]}`).join("\n");

    const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

    if (hmac !== hash) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    res.json({ message: "Login Successful!", user: data });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
