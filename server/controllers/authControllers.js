
const User = require('../models/user');
const {
    signToken,
    verifyToken,
    generateVerificationCode,
    sendVerificationEmail,
    getTokenFromHeaderOrCookie
} = require('../middlewares/jwt.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


const register = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { email, password } = req.body;

        // Check if user exists
        console.log('Checking if user exists...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create verification code
        console.log('Generating verification code...');
        const verificationCode = generateVerificationCode(); // <-- Here
        console.log('Verification code:', verificationCode);

        const codeExpiry = new Date(Date.now() + 60 * 1000); // Set expiry time to 1 minute

        const user = await User.create({ email, password, verificationCode, codeExpiry });
        console.log('User created:', user);

        // Send verification email
        console.log('Sending verification email...');
        await sendVerificationEmail(email, verificationCode);
        console.log('Verification email sent');

        res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const verifyEmail = async (req, res) => {
    try {
      const { email, code } = req.body;
  
      const user = await User.findOne({ email, verificationCode: code });
      if (!user) return res.status(400).json({ message: 'Invalid verification code' });
  
      if (user.codeExpiry < Date.now()) {
        return res.status(400).json({ message: 'Verification code expired' });
      }
  
      user.isVerified = true;
      user.verificationCode = undefined;
      user.codeExpiry = undefined;
      await user.save();
  
      res.status(200).json({ 
        message: 'Email verified successfully',
        user: { email: user.email, isVerified: user.isVerified }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!(await user.comparePassword(password))) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            console.log('User email not verified');
            return res.status(200).json({
                message: 'Please verify your email before logging in',
                status: 'unverified',
                user: {
                    email: user.email,
                    // Include other user details if needed
                }
            });
        }

        // Generate access token
        const accessToken = signToken(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRES_IN
        );

        // Generate refresh token
        const refreshToken = signToken(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            process.env.JWT_REFRESH_EXPIRES_IN
        );

        // Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens in httpOnly cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 3600000, // 7 days
        });
        console.log(accessToken)

        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email,
                isVerified: user.isVerified,
                role:user.role

            },
            token: accessToken,
            refreshToken 
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const requestNewCode = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      const newVerificationCode = generateVerificationCode();
      const newCodeExpiry = new Date(Date.now() + 60 * 1000); // 1 minute
  
      user.verificationCode = newVerificationCode;
      user.codeExpiry = newCodeExpiry;
      await user.save();
  
      await sendVerificationEmail(email, newVerificationCode);
  
      res.status(200).json({ message: 'New verification code sent' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  



// Refresh access token
const refreshToken = async (req, res) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken; // Make sure this is set correctly
        if (!refreshTokenFromCookie) return res.status(401).json({ message: 'No refresh token provided' });

        let decoded;
        try {
            decoded = await promisify(jwt.verify)(refreshTokenFromCookie, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Find user and verify refresh token matches
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshTokenFromCookie) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const newAccessToken = signToken(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRES_IN
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
            message: 'Access token refreshed',
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const logout = async (req, res) => {
    try {
      const { refreshToken } = getTokenFromHeaderOrCookie(req);
      console.log('Refresh Token:', refreshToken); // Log the refresh token
  
      if (refreshToken) {
        const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log('Decoded Token:', decoded); // Log the decoded token
  
        if (decoded) {
          const user = await User.findById(decoded.userId);
          if (user) {
            user.refreshToken = undefined; // Remove refresh token
            await user.save(); // Save changes to the user
          }
        }
      }
  
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
  
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Get current user
const getMe = async (req, res) => {
    try {
        // At this point, the token has already been verified by verifyToken middleware
        const user = await User.findById(req.user.userId).select('-password -refreshToken -verificationCode');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    refreshToken,
    logout,
    requestNewCode,
    getMe
}