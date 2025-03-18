import React, { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    // Create the Telegram widget script element
    const script = document.createElement("script");
    // Use the official Telegram widget script URL (version 7)
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    // Set the required attributes:
    // - data-telegram-login: your bot username (without @)
    // - data-size: button size (e.g. "large")
    // - data-auth-url: the URL of your backend endpoint that verifies the login data
    // - data-request-access: (optional) "write" or "read"
    script.setAttribute("data-telegram-login", "rakhi3690Bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", "https://telegram-auth-lilac.vercel.app/auth");
    script.setAttribute("data-request-access", "write");
    // Append the script to the container div
    document.getElementById("telegram-login-container").appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold mb-4">Login To Telegram</h2>
      <div id="telegram-login-container"></div>
    </div>
  );
};

export default TelegramLogin;
