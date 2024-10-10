import React from 'react';
import '../../css/profilepage/profilepage.css';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tabs } from 'antd';
import Orders from '../Order/Orders';
import { useUserContext } from '../../context/UserContext';
import Loader from '../Loader/Loader';
import UnReviewedProducts from '../Reviews/UnReviewedProducts';

const ProfilePage = () => {
    const { user, logout } = useUserContext();

    // Ensure user object is properly loaded
    if (!user) {
        return <Loader height={100} />; // Placeholder while user data is loading
    }

    const handleLogout = async () => {
        await logout();
    };

    const items = [
        {
            key: '1',
            label: 'My Orders',
            children: <Orders />,
        },
        {
            key: '2',
            label: 'Add Review',
            children: <UnReviewedProducts />,
        }
    ];

    return (
        <div className='profile-page-container'>
            <div className='profile-page-sidebar'>
                <div className='profile-page-sidebar-container'>
                    <Avatar 
                        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 164, xxl: 180 }}
                        icon={<UserOutlined />}
                    />
                    <div className='profile-page-sidebar-container-info'>
                        <span className='profile-page-sidebar-container-info-name'>
                            {user.firstName} {user.lastName}
                        </span>
                        <span className='profile-page-sidebar-container-info-email'>
                            {user.email}
                        </span>
                        <span className='profile-page-sidebar-container-info-email'>
                            Contact: {user.contactNumber}
                        </span>
                    </div>

                    <div className='profile-page-sidebar-container-logout'>
                        <button 
                            className='profile-page-sidebar-container-logout-btn'
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className='profile-page-tabs'>
                <div className='profile-page-sidebar-tabs-container'>
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
