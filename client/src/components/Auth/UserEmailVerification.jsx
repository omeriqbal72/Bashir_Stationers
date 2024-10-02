import React, { useState, useContext, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext.jsx'
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import '../../css/userauth.css';

const UserEmailVerification = () => {

  const [btnLoading, setbtnLoading] = useState(false);
  const [code, setCode] = useState('');            // Store verification code
  const [error, setError] = useState('');          // Store error messages
  const [timer, setTimer] = useState(60);          // Countdown timer for 60 seconds
  const [timerActive, setTimerActive] = useState(true); // Control whether timer is active or not
  const { verifyEmail, requestNewCode } = useUserContext(); // API actions from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setTimeout(async () => {
      try {
        setError('');  // Clear error before verifying
        await verifyEmail(code);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. Please check the code and try again.');
      }
      setbtnLoading(false);
    }, 500); // 500 milliseconds delay
  };

  // Handle timer countdown
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


  // Handle request for a new verification code
  const handleRequestNewCode = async () => {
    try {
      setError('');  // Clear any previous errors
      await requestNewCode();
      setTimer(60);   // Reset timer
      setTimerActive(true);  // Activate the timer again
    } catch (err) {
      setError('Failed to request a new code. Please try again later.');
    }
  };

  return (

    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <Input className='login-inputs'
          type="text"
          placeholder="Enter Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={!timerActive}
          required={true}
        />

        <Button type='none' htmlType="submit" size='large' disabled={!timerActive} className="login-button" loading={btnLoading}>
          Verify Email
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}
      </form>

      {/* Button to request a new verification code, displayed when the timer expires */}
      {!timerActive && (
        <button onClick={handleRequestNewCode}>
          Request New Code
        </button>
      )}

      {/* Timer and status messages */}
      <p>
        {timerActive
          ? `Time remaining: ${timer}s`    // Display remaining time while active
          : 'Code expired. Request a new code.'} {/* Show expiration message when the timer runs out */}
      </p>

    </>
  );
};

export default UserEmailVerification;
