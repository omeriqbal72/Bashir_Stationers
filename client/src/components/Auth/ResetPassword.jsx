import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext.jsx';
import { useLocation , useNavigate} from 'react-router-dom';

const ResetPassword = () => {
  const { resetPassword, error } = useUserContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const email = location.state?.email;  // Get the email from the previous page

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const msg = await resetPassword(email, newPassword);
      setMessage(msg); 
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ResetPassword;
