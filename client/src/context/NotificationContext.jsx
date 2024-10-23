
import React, { createContext, useContext } from 'react';
import { notification, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message, description, navigate) => {
        api[type]({
            message,
            description,
            placement: 'topRight',
            duration: 5,
            showProgress: true,
            pauseOnHover: true,
            btn: (
                <Button
                    type="primary"
                    onClick={() => navigate('/mycart')}
                    style={{ marginTop: '10px' }}
                >
                    View Cart
                </Button>
            ),
        });
    };

    return (
        <NotificationContext.Provider value={{ openNotification }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
