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
    // Check the Authorization header first for access token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return {
        accessToken: authHeader.split(' ')[1], // Return access token from header
        refreshToken: null // No refresh token found in header
      };
    }
  
    // Fallback to cookies for both access and refresh tokens
    const accessToken = req.cookies.accessToken || null;
    const refreshToken = req.cookies.refreshToken || null;
    console.log(accessToken)
    console.log(refreshToken)
    return {
      accessToken,
      refreshToken // Return refresh token from cookies if available
    };
  };
  
  
  // Usage in a route
 const verifyToken = async (req, res, next) => {
    const { accessToken, refreshToken } = getTokenFromHeaderOrCookie(req); // Get tokens from headers or cookies

    if (!accessToken) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }

    try {
        const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to the request object
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' }); // Handle manipulated or expired tokens
    }
};


const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex'); // 6 characters
};

const sendVerificationEmail = async (email, code) => {
    const message = `Your verification code is ${code}`;
    console.log('Sending email with details:', { email, code });
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
  
module.exports = {
  signToken,
  verifyToken,
  generateVerificationCode,
  sendVerificationEmail,
  getTokenFromHeaderOrCookie
};
