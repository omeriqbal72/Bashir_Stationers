const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const sendEmail = require('./mailHelper'); // Updated file name to match

const signToken = (payload, secret, expiresIn) => {
  console.log('Signing token with expiresIn:', expiresIn);

  if (!expiresIn || typeof expiresIn !== 'string') {
    throw new Error('Invalid expiresIn value');
  }

  return jwt.sign(payload, secret, { expiresIn });
};


const getTokenFromHeaderOrCookie = (req) => {

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return {
      token: authHeader.split(' ')[1],
      refreshToken: null
    };
  }

  const token = req.cookies.token || null;
  const refreshToken = req.cookies.refreshToken || null;

  return {
    token,
    refreshToken
  };
};

const verifyToken = async (req, res, next) => {
  const { token, refreshToken } = getTokenFromHeaderOrCookie(req);

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    // Token is expired
    if (error.name === 'TokenExpiredError') {
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing. Please log in again.' });
      }

      return res.status(401).json({ message: 'TokenExpired' });
    }

    return res.status(401).json({ message: 'InvalidToken' });
  }
};

const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex'); // 6 characters
};

const sendVerificationEmail = async (email, code) => {
  const message = `Your verification code is ${code}`;
  try {
    await sendEmail({
      to: email,
      subject: 'Email Verification',
      text: message,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendResetPasswordEmail = async (email, resetCode) => {
  const message = `Your password reset code is ${resetCode}. Please use this code to reset your password.`;
  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Confirmation',
      text: message,
    });
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

const sendOrderConfirmationEmail = async (email, order) => {
  const message = `
       <p>Thank you for your order!</p>
    
    <p>Your order has been successfully placed with the following details:</p>
    
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Amount:</strong> Rs.${order.totalAmount}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    
    <p><strong>Shipping Address:</strong><br>
    ${order.shippingAddress.street},<br> 
    ${order.shippingAddress.city},<br>
    ${order.shippingAddress.postalCode},<br>
    ${order.shippingAddress.country}</p>
    
    <p>We will notify you once your order is on its way.</p>
    
    <p>Thank you for shopping with us!</p>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Order Confirmation',
      html: message,
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};
const sendOrderVerificationEmail = async (email, code) => {
  const message = `Your Order verification code is ${code}`;
  try {
    await sendEmail({
      to: email,
      subject: 'Email Verification',
      text: message,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};



module.exports = {
  signToken,
  verifyToken,
  generateVerificationCode,
  sendVerificationEmail,
  getTokenFromHeaderOrCookie,
  sendResetPasswordEmail,
  sendOrderConfirmationEmail,
  sendOrderVerificationEmail
};
