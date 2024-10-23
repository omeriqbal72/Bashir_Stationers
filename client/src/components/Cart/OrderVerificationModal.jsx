// EmailVerificationModal.js
import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import publicAxiosInstance from '../../utils/publicAxiosInstance';
import { useNavigate } from 'react-router-dom';

const orderVerificationModal = ({ isVisible, onConfirm, onCancel, verificationCode, setVerificationCode, error }) => {
    const handleCodeChange = (e) => {
        const newValue = e.target.value;
        setVerificationCode(newValue);
    };

    return (
        <Modal
            title="Email Verification"
            visible={isVisible}
            centered
            width={500}
            footer={[
                <div key="verify-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', gap: '0.5rem' }}>
                    <p>We sent an order email verification code to your given email address. Enter the code to proceed with the order placement.</p>
                    <Input
                        type="text"
                        name="orderverificationCode"
                        value={verificationCode}
                        onChange={handleCodeChange}
                        placeholder="Enter Verification Code"
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button
                        key="verify-email"
                        type="primary"
                        onClick={onConfirm}
                    >
                        Verify Email
                    </Button>
                </div>
            ]}
            onCancel={onCancel}
        >
            
        </Modal>
    );
};

export default orderVerificationModal;
