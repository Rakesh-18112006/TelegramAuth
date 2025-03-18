import React, { useState } from 'react';
import TelegramLoginButton from 'react-telegram-login';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.first_name}{user.last_name ? ` ${user.last_name}` : ''} {user.username ? `(@${user.username})` : ''}</p>
          {user.photo_url && <img src={user.photo_url} alt="Profile" />}
        </div>
      ) : (
        <TelegramLoginButton
          botName="your_bot_name" // Replace with your actual bot name
          dataOnauth={user => setUser(user)}
        />
      )}
    </div>
  );
}

export default App;