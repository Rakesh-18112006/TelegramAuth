import React, { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    const container = document.getElementById("telegram-login-container");

    if (container) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?7";
      script.async = true;
      script.setAttribute("data-telegram-login", "rakhi3690Bot"); // Replace with your bot username
      script.setAttribute("data-size", "large");
      script.setAttribute("data-auth-url", "https://9238-2409-40f0-3036-cf56-25d9-2fc3-ad5d-1519.ngrok-free.app/auth");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-userpic", "true");
      script.setAttribute("data-radius", "10");

      // ✅ Add onAuth function to log response data
      script.setAttribute("data-onAuth", "telegramAuth");

      container.appendChild(script);
    }

    // ✅ Define onAuth function globally
    window.telegramAuth = (user) => {
      console.log("Telegram Auth Data:", user);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold mb-4">Login To Telegram</h2>
      <div id="telegram-login-container"></div>
    </div>
  );
};

export default TelegramLogin;
