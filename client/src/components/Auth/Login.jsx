import React, { useState, useEffect } from 'react';
import '../../css/login.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Button } from 'antd';
import bgImg from '../../Ui_Images/login-bg.jpg'
import { useUserContext } from '../../context/UserContext.jsx'
import { Link , useNavigate} from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [btnLoading, setbtnLoading] = useState(false);

  const { user, login, loading , error } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true }); 
    }
  }, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    // Adding a delay before the actual login process starts
    setTimeout(async () => {
      await login(email, password);
      setbtnLoading(false);
    }, 500); // 500 milliseconds delay
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


            <Button type='none' htmlType="submit" size='large' className="login-button" loading={btnLoading}>
              Login
            </Button>

            <div className="additional-options">
            <Link to="/forgot-password">Forgot Password?</Link>
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


