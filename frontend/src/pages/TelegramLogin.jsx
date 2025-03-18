import React, { useEffect } from "react";

const TelegramLogin = () => {
  const botUsername = "rakhi3690Bot"; // Replace with your bot's username

  useEffect(() => {
    // Load Telegram login script dynamically 
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", "https://telegram-auth-lilac.vercel.app/auth");
       // Replace with your backend endpoint
    script.setAttribute("data-request-access", "write"); // Optional: Read-only or Write access
    document.getElementById("telegram-login-container").appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold mb-4">Login with Telegram</h2>
      <div id="telegram-login-container"></div>
    </div>
  );
};

export default TelegramLogin;


