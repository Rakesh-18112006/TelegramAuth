import React from 'react';
import { LoginButton } from '@telegram-auth/react';

const TelegramLogin = () => {
  const handleTelegramAuth = (user) => {
    console.log("User Data:", user);

    // Send user data to backend for verification
    fetch("https://your-backend.vercel.app/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => console.log("Auth Response:", data))
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold mb-4">Login with Telegram</h2>
      <LoginButton
        botName="rakhi3690Bot" // Replace with your bot username (without @)
        authCallbackUrl="https://your-backend.vercel.app/auth" // Replace with your backend URL
        onAuthCallback={handleTelegramAuth}
      />
    </div>
  );
};

export default TelegramLogin;
