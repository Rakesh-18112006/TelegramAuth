import React from 'react';
import TelegramLoginButton from 'react-telegram-login';

function LoginButton() {
  return (
    <TelegramLoginButton
      botName="rakhi3690Bot" // Replace with your bot's name
      dataOnauth={(user) => {
        console.log(user); // Handle user data, e.g., id, first_name, last_name, etc.
      }}
    />
  );
}

export default LoginButton;