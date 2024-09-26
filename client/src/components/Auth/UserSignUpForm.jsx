// frontend/components/Auth/Signup.jsx
import { useState, useContext } from 'react';
import { useUserContext } from '../../context/UserContext.jsx'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import '../../css/userauth.css';

const Signup = () => {

  const [btnLoading, setbtnLoading] = useState(false);

  const { signup } = useUserContext();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnLoading(true);
    // Adding a delay before the actual login process starts
    setTimeout(async () => {
      await signup(user);
      alert('Verification email sent, please check your inbox.');
      setbtnLoading(false);
    }, 500); // 500 milliseconds delay
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <Input className='login-inputs'
        type="text"
        name="firstName"
        placeholder="First Name"
        value={user.firstName}
        onChange={handleChange}
        required={true}
      />

      <Input className='login-inputs'
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={user.lastName}
        onChange={handleChange}
        required={true}
      />

      <Input className='login-inputs'
        placeholder="Email"
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        required={true}
      />

      <Input.Password
        className='login-inputs'
        placeholder="Password"
        name="password"
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        value={user.password}
        onChange={handleChange}
        required={true}
      />

      <Button type='none' htmlType="submit" size='large' className="login-button" loading={btnLoading}>
        Sign Up
      </Button>

      <div className="additional-options">
      <Link to="/login">Login to your account</Link>
      </div>

      {/* {error && <p>{error}</p>} */}
    </form>


  );
};

export default Signup;
