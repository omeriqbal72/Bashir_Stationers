import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import '../../css/userauth.css';

const UserForgotPassword = () => {
  
  const [btnLoading, setbtnLoading] = useState(false);
  const { forgotPassword, verifyResetCode, error } = useUserContext();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [message, setMessage] = useState('');
  const [codeFieldVisible, setCodeFieldVisible] = useState(false);
  const [emailFieldVisible, setEmailFieldVisible] = useState(true);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setTimeout(async () => {
      try {
        const msg = await forgotPassword(email);
        setMessage(msg);  // Display email sent confirmation
        setEmailFieldVisible(false);
        setCodeFieldVisible(true);
      } catch (err) {
        console.error(err);
      }
      setbtnLoading(false);
    }, 500);
  
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    setTimeout(async () => {
      try {
        const msg = await verifyResetCode(email, resetCode);
        setMessage(msg);
        navigate('/reset-password', { state: { email } });
      } catch (err) {
        console.error(err);
      }
      setbtnLoading(false);
    }, 500); // 500 milliseconds delay
 
  };

  return (
    <>
      {emailFieldVisible &&
        <form className="login-form" onSubmit={handleEmailSubmit}>
          <Input className='login-inputs'
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <Button type='none' htmlType="submit" size='large' className="login-button" loading={btnLoading}>
            Send Reset Code
          </Button>

        </form>

      }
      {codeFieldVisible && (
        <form className="login-form" onSubmit={handleCodeSubmit}>
          <Input className='login-inputs'
            type="text"
            placeholder="Enter the reset code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required={true}
          />
          <Button type='none' htmlType="submit" size='large' className="login-button" loading={btnLoading}>
            Verify Code
          </Button>

        </form>
      )}

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </>

  );
};

export default UserForgotPassword;
