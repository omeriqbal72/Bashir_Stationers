import React, { useState, useContext } from 'react';
import { useUserContext } from '../../context/UserContext.jsx'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login , error} = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password); // Handle login; error is managed by context
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>} {/* Display the error message */}
      </form>
    </div>
  );
};

export default LoginPage;
