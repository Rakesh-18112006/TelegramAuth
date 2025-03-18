const express = require("express");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Telegram Auth Route
app.get("/auth", (req, res) => {
    const { hash, ...data } = req.query;
    const token = "7339338847:AAEOVoYFUnYUM2ieMI8sXpME-zff-_K-64Q"; // Add your bot token in .env
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(token).digest();

    const checkString = Object.keys(data)
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join("\n");

    const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

    if (hmac !== hash) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    res.json({ message: "Login Successful!", user: data });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
