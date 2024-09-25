import React, { useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import '../../css/login.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import bgImg from '../../Ui_Images/login-bg.jpg'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (


    <div className="login-container">
      <img src={bgImg} alt="Login screen" />
      <div className="login-sub-container">
        <div className="login-left">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>

            <Input className='login-inputs'
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />

            <Input.Password
              className='login-inputs'
              placeholder="Password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />


            <button type="submit" className="login-button">Login</button>

            <div className="additional-options">
              <a >Forget Password?</a>
              <p>Don't have an account? <a href="#signup">Sign Up Now</a></p>
            </div>

            {error && <p>{error}</p>}
          </form>


        </div>
        <div className="login-right">
          <div className="login-right-content">
            <h1>Rasheed</h1>
            <h1>Stationers</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


