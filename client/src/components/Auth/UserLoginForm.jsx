import React, { useState, useEffect} from 'react';
import '../../css/userauth.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { useUserContext } from '../../context/UserContext.jsx'
import { Link, useNavigate } from 'react-router-dom';

const UserLoginForm = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btnLoading, setbtnLoading] = useState(false);
    const {  login , error } = useUserContext();


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

        <form className="login-form" onSubmit={handleSubmit}>
            <Input className='login-inputs'
                placeholder="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
            />

            <Input.Password
                className='login-inputs'
                name="password"
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
                <p>Don't have an account? <Link to="/register">Sign Up Now</Link></p>
            </div>

            {error && <p>{error}</p>}
        </form>

    );
};

export default UserLoginForm;


