import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const { forgotPassword, verifyResetCode, error } = useUserContext();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [message, setMessage] = useState('');
  const [codeFieldVisible, setCodeFieldVisible] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setCodeFieldVisible(true); // Show reset code input immediately

    try {
      const msg = await forgotPassword(email);
      setMessage(msg);  // Display email sent confirmation
    } catch (err) {
      console.error(err);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const msg = await verifyResetCode(email, resetCode);
      setMessage(msg);
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Code</button>
      </form>

      {codeFieldVisible && (
        <form onSubmit={handleCodeSubmit}>
          <input
            type="text"
            placeholder="Enter the reset code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
          />
          <button type="submit">Verify Code</button>
        </form>
      )}

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
