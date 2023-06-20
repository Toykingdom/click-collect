"use client"
import { useState } from 'react';

// Sample user and store information
const validUser = {
  username: 'john',
  password: 'password',
  storeId: 'store123',
};

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate API authentication
    if (username === validUser.username && password === validUser.password) {
      // Check if the user's store ID matches the allowed store
      if (validUser.storeId === 'store123') {
        onLogin(true);
      } else {
        setError('Access restricted to a specific store.');
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
