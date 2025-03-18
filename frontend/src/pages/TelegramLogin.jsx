import React, { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t.me/js/telegrambotwidget.js";
    script.async = true;
    script.setAttribute("data-telegrambotlogin", "rakhi3690Bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", "https://telegramauth-lilac.vercel.app/auth");
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegrambotlogincontainer").appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold mb-4">Login with Telegram</h2>
      <div id="telegrambotlogincontainer"></div>
    </div>
  );
};

export default TelegramLogin;