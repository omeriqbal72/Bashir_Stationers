import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import publicAxiosInstance from '../../utils/publicAxiosInstance';

const GuestEnterCode = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.emailAddress; // Get the email from the previous page

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await publicAxiosInstance.post('/order/confirm', {
                email,
                verificationCode
            });
            console.log('Order placed successfully:', response.data);
            navigate('/order-confirmation'); // Navigate to order confirmation page
        } catch (err) {
            console.error('Error confirming order:', err);
            setError('Failed to confirm order.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Enter Verification Code:</label>
            <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
            />
            <button type="submit">Confirm Order</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default GuestEnterCode;
