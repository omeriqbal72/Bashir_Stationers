import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext.jsx';
import { Input, Button } from 'antd';
import '../../css/userauth.css';
import { useLocation, useNavigate } from 'react-router-dom';

const UserResetPassword = () => {

  const [btnLoading, setbtnLoading] = useState(false);
  const { resetPassword, error } = useUserContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const email = location.state?.email;  // Get the email from the previous page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setbtnLoading(false);
      return;
    }
    setTimeout(async () => {
      try {
        const msg = await resetPassword(email, newPassword);
        setbtnLoading(false);
        setMessage(msg);
      } catch (err) {
        setbtnLoading(false);
        console.error(err);
      }
    }, 500);

  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <Input className='login-inputs'
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required={true}
        />

        <Input className='login-inputs'
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required={true}
        />
        <Button type='none' htmlType="submit" size='large' className="login-button" loading={btnLoading}>
          Reset Password
        </Button>

      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </>
  );
};

export default UserResetPassword;
