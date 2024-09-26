
const User = require('../models/user');
const Cart = require('../models/cart.js')
const {
    signToken,
    generateVerificationCode,
    sendVerificationEmail,
    getTokenFromHeaderOrCookie,
    sendResetPasswordEmail,
} = require('../middlewares/jwt.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


const register = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { firstName, lastName, email, password } = req.body;

        // Check if user exists
        console.log('Checking if user exists...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }


        const verificationCode = generateVerificationCode(); // <-- Here


        const codeExpiry = new Date(Date.now() + 60 * 1000); // Set expiry time to 1 minute

        const user = await User.create({ firstName, lastName, email, password, verificationCode, codeExpiry });


        await sendVerificationEmail(email, verificationCode);

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
        const { email, password, cart } = req.body; // Expect cart from client-side local storage

        if (cart && Array.isArray(cart)) {
            // Ensure every item in the cart has a product._id field
            const invalidItems = cart.filter(item => !item.product._id);
            if (invalidItems.length > 0) {
                console.error('Invalid items found in cart:', invalidItems);
                return res.status(400).json({ message: 'Some items in the cart are missing the _id field.' });
            }
        }

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

        if (!user.isVerified) {
            console.log('User email not verified');
            return res.status(200).json({
                message: 'Please verify your email before logging in',
                status: 'unverified',
                user: {
                    email: user.email,
                },
            });
        }

        // Sync the cart
        if (user.role !== 'admin') {
            let userCart = await Cart.findOne({ user: user._id });
            if (cart.length > 0) {
                if (userCart) {
                    // Merge local cart with the user's existing cart
                    cart.forEach((localItem) => {
                        const existingItem = userCart.items.find(item => item.product.toString() === localItem.product._id.toString());

                        if (existingItem) {
                            existingItem.quantity = localItem.quantity;
                        } else {
                            userCart.items.push({
                                product: localItem.product._id,
                                quantity: localItem.quantity,
                                selectedColor: localItem.selectedColor, // If applicable
                            });
                        }
                    });
                } else {
                   
                    userCart = new Cart({
                        user: user._id,
                        items: cart.map(localItem => ({
                            product: localItem.product._id,
                            quantity: localItem.quantity,
                            selectedColor: localItem.selectedColor, // If applicable
                        })),
                    });
                }

                await userCart.save();
            } else {
                // If no items in local storage, create an empty cart instance
                if (!userCart) {
                    userCart = new Cart({
                        user: user._id,
                        items: [], // Create an empty items array
                    });

                    await userCart.save(); // Save the empty cart to the database
                }
            }
        }


        // Generate access token
        const token = signToken(
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

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('token', token, {
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

        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            },
            token,
            refreshToken,
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

const refreshToken = async (req, res) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;
        if (!refreshTokenFromCookie) {
            console.log('No refresh token provided');
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        let decoded;
        try {
            decoded = await promisify(jwt.verify)(refreshTokenFromCookie, process.env.JWT_REFRESH_SECRET);
            console.log('Decoded Token:', decoded);
        } catch (error) {
            console.log('Invalid or expired refresh token:', error.message);
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('User not found');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        console.log('User from Database:', user);
        if (user.refreshToken !== refreshTokenFromCookie) {
            console.log('Refresh token mismatch');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newToken = signToken(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRES_IN
        );

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
            message: 'Access token refreshed',
            token: newToken,
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
            console.log('Decoded Token:', decoded);
            if (decoded) {
                const user = await User.findById(decoded.userId);
                if (user) {
                    user.refreshToken = undefined; // Clear the refresh token from the user record
                    await user.save();
                }
            }
        }

        res.clearCookie('token');
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Generate a reset code and expiry
        const resetCode = generateVerificationCode(); // Your function for generating the code
        const resetCodeExpiry = new Date(Date.now() + 60 * 1000 * 10); // 10-minute expiry
    
        // Update the user's document with the reset code and expiry
        user.resetPasswordCode = resetCode;
        user.resetPasswordCodeExpiry = resetCodeExpiry;
        await user.save();
    
        // Send the reset code via email
        await sendResetPasswordEmail(user.email, resetCode);
    
        res.status(200).json({ message: 'Reset code sent successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
  };

  const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (!user.resetPasswordCode || !user.resetPasswordCodeExpiry) {
          return res.status(400).json({ message: 'No reset code found, request a new one' });
        }
    
        if (user.resetPasswordCode.trim() !== code.trim()) {
          return res.status(400).json({ message: 'Invalid reset code' });
        }
    
        if (user.resetPasswordCodeExpiry.getTime() < Date.now()) {
          return res.status(400).json({ message: 'Expired reset code' });
        }
    
        res.status(200).json({ message: 'Code verified successfully' });
      } catch (error) {
        console.error('Error in verifyResetCode:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
};


  const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.password = newPassword;
      user.resetPasswordCode = null;  
      user.resetPasswordCodeExpiry = null; 
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
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
    getMe,
    resetPassword,
    verifyResetCode,
    forgotPassword
}