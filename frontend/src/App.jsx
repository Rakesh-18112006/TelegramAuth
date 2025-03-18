import React from "react";
import { LoginButton } from "@telegram-auth/react";

function App() {
  const handleAuth = async () => {
    console.log("Telegram Auth Data:", data);

    try {
      const response = await fetch("https://telegram-auth-3ldq499xw-rakesh-18112006s-projects.vercel.app//auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server Response:", result);
    } catch (error) {
      console.error("Error sending auth data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold mb-4">Login with Telegram</h2>
      <LoginButton
        botUsername="rakhi369_bot" // Replace with your bot username
        onAuthCallback={handleAuth}
        buttonSize="large"
        cornerRadius={5}
        showAvatar={true}
        lang="en"
      />
    </div>
  );
}

export default App;
