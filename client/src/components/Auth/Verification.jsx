// src/components/VerifyEmailPage.js

import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../../context/UserContext';

const Verification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // Timer set to 60 seconds
  const [timerActive, setTimerActive] = useState(true);
  const { verifyEmail, requestNewCode } = useContext(UserContext);

  useEffect(() => {
    if (timer > 0 && timerActive) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer <= 0) {
      setTimerActive(false);
    }
  }, [timer, timerActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(code);
    } catch (err) {
      setError('Verification failed. Please check the code and try again.');
    }
  };

  const handleRequestNewCode = async () => {
    try {
      await requestNewCode();
      setTimer(60); // Reset the timer
      setTimerActive(true);
    } catch (err) {
      setError('Failed to request a new code.');
    }
  };

  return (
    <div>
      <h1>Verify Your Email</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          disabled={!timerActive}
        />
        <button type="submit" disabled={!timerActive}>Verify</button>
        {error && <p>{error}</p>}
      </form>
      {!timerActive && (
        <button onClick={handleRequestNewCode}>Request New Code</button>
      )}
      <p>{timerActive ? `Time remaining: ${timer}s` : 'Code expired. Request a new code.'}</p>
    </div>
  );
};

export default Verification;
