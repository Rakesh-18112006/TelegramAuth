import React, { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    // Create the Telegram widget script element
    const script = document.createElement("script");
    // Use the official Telegram widget URL (version 7)
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    // Use the correct attribute name: data-telegram-login (without @)
    script.setAttribute("data-telegram-login", "rakhi3690Bot");
    script.setAttribute("data-size", "large");
    // Make sure this URL exactly matches your deployed backend endpoint
    script.setAttribute("data-auth-url", "https://telegram-auth-lilac.vercel.app/auth");
    script.setAttribute("data-request-access", "write");
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
