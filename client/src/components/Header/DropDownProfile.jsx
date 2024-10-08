import React from 'react';
import { Dropdown, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserContext } from '../../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const DropDownProfile = (props) => {
    const navigate = useNavigate();
    const { logout } = useUserContext();
    const isLoggedIn = props.isLoggedIn; // Pass this value from props (true for logged in, false for logged out)

    // Conditionally add the Profile item if the user is logged in
    const items = [
        ...(isLoggedIn
            ? [{
                  label: 'Profile', // Only show Profile if logged in
                  key: '1',
              }]
            : []),
        {
            label: isLoggedIn ? 'Logout' : 'Login',
            key: '2',
            onClick: () => {
                if (isLoggedIn) {
                    logout(); 
                    window.location.reload();
                } else {
                    navigate('/login'); // Navigate to login page if the user is not logged in
                }
            },
        },
    ];

    return (
        <Dropdown
            menu={{
                items,
            }}
        >
            <UserOutlined style={{ fontSize: '26px', cursor: 'pointer' }} />
        </Dropdown>
    );
};

export default DropDownProfile;
