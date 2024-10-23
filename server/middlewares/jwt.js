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
  
  const message = `
   <html>
    <head>
      <style>
        .email-container{
          display: flex;
          margin: 0 9rem;
          padding: 2rem;
          background-color: rgb(237, 237, 237);
          width:70%;
        }

        .email-header {
          background-color: #000000; 
          color: #ffffff; 
          padding: 1.5rem;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }

        .email-body {
          width:100%;
          background-color: #ffffff; 
          color: #333333; 
          padding: 1rem;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .email-body strong {
          font-weight: bold;
        }

        .email-body-h2{
          text-align: center;
           color: red;
        }

        .email-footer{
          padding: .5rem;
          background-color: #B22222;
          color: rgb(237, 237, 237); 
          text-align: center;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        
            <div class="email-body">
              <div class="email-header">
                Rasheed Stationers
              </div>

              <h1>Verify Your Email Address.</h1>
              <p>Dear Customer,</p>
              <p>Thank you for visiting our Store!</p>
              <p>Your verification code is:</p>
              <div class="email-body-h2"> 
                <h2>${code}</h2>
              </div>
              <p>Use this code to verify your email before registering yourself.</p>
              
              <div class="email-footer">
                <h3>This is an automated email, please do not reply.</h3>
              </div>
          </div>
  
      </div>
    </body>
  </html>
  `;
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
  const message = `
  <html>
    <head>
      <style>

        .email-container{
          display: flex;
          margin: 0 9rem;
          padding: 2rem;
          background-color: rgb(237, 237, 237);
          width:70%;
        }

        .email-header {
          background-color: #000000; 
          color: #ffffff; 
          padding: 1.5rem;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }

        .email-body {
          width:100%;
          background-color: #ffffff; 
          color: #333333; 
          padding: 1rem;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .email-body strong {
          font-weight: bold;
        }

        .email-body-h2{
          text-align: center;
          color: red;
        }

        .email-footer{
          padding: .5rem;
          background-color: #B22222;
          color: rgb(237, 237, 237); 
          text-align: center;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }

      </style>
    </head>
    <body>
      <div class="email-container">
        
            <div class="email-body">
              <div class="email-header">
                Rasheed Stationers
              </div>

              <h1>Reset Your Password.</h1>
              <p>Dear Customer,</p>
              <p>Hope this will help you resetting your password.!</p>
              <p>Your password reset code is: </p>
              <div class="email-body-h2"> 
                <h2>${resetCode}</h2>
              </div>

              <p>Use this code to reset password.</p>
              
              <div class="email-footer">
                <smaller>This is an automated email, please do not reply.</smaller>
              </div>
          </div>
  
      </div>
    </body>
  </html>
  `;
  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Confirmation',
      html: message,
    });
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

const sendOrderConfirmationEmail = async (email, order) => {
  const message = `
  <html>
    <head>
      <style>
        .email-container{
          display: flex;
          margin: 0 10rem;
          padding: 2rem 6rem;
          width:40%;
          background-color: rgb(237, 237, 237);
        }

        .email-header {
          background-color: #000000; 
          color: #ffffff; 
          padding: 1.5rem;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }

        .email-body {
          width:100%;
          background-color: #ffffff; 
          color: #333333; 
          padding: 1rem;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .email-body strong {
          font-weight: bold;
        }

        .email-footer{
          padding: .3rem;
          background-color: #B22222;
          color: #ffffff; 
          text-align: center;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }

      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-sub-container">
         

          <div class="email-body">
           <div class="email-header">
            Rasheed Stationers
          </div>
            <h1>Order Placed Successfully</h1>
            <p>Dear Customer,</p>
            <p>Thank you for your order!</p>
            <p><strong>Total Amount:</strong> Rs.${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      
            <p><strong>Shipping Address: </strong>
            ${order.shippingAddress.street}, 
            ${order.shippingAddress.city},
            ${order.shippingAddress.country}</p>

            <p><strong>Zip Code: </strong> 
            ${order.shippingAddress.postalCode}</p>
      
            <p>We will notify you once your order is on its way.</p>
      
            <p>Thank you for shopping with us!</p>
            <div class="email-footer">
            <smaller>This is an automated email, please do not reply.</smaller>
          </div>
          </div>

          
        </div>
      </div>
    </body>
  </html>
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
  const message = `
   <html>
    <head>
      <style>
        .email-container{
          display: flex;
          margin: 0 9rem;
          padding: 2rem;
          background-color: rgb(237, 237, 237);
          width:70%;
        }

        .email-header {
          background-color: #000000; 
          color: #ffffff; 
          padding: 1.5rem;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }

        .email-body {
          width:100%;
          background-color: #ffffff; 
          color: #333333; 
          padding: 1rem;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .email-body strong {
          font-weight: bold;
        }

        .email-body-h2{
          text-align: center;
          color: red;
        }
        .email-footer{
          padding: .5rem;
          background-color: #B22222;
          color: rgb(237, 237, 237); 
          text-align: center;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }

      </style>
    </head>
    <body>
      <div class="email-container">
        
            <div class="email-body">
              <div class="email-header">
                Rasheed Stationers
              </div>

              <h1>Confirm Your Order.</h1>
              <p>Dear Customer,</p>
              <p>Thank you for visiting our Store!.</p>
              <p>Your Order verification code is:</p>
              <div class="email-body-h2"> 
                <h2>${code}</h2>
              </div>
              <p>Please enter this code to confirm your order</p>
              
              <div class="email-footer">
                <smaller>This is an automated email, please do not reply.</smaller>
              </div>
          </div>
  
      </div>
    </body>
  </html>
  `;
  try {
    await sendEmail({
      to: email,
      subject: 'Email Verification',
      html: message,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendTrackingIdEmail = async (existingOrder , trackingIdUpdated ) => {
  try {
    const { email } = existingOrder.user;
    console.log(email);
    const message = `
   <html>
    <head>
      <style>
        .email-container{
          display: flex;
          margin: 0 9rem;
          padding: 2rem;
          background-color: rgb(237, 237, 237);
          width:70%;
        }

        .email-header {
          background-color: #000000; 
          color: #ffffff; 
          padding: 1.5rem;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }

        .email-body {
          width:100%;
          background-color: #ffffff; 
          color: #333333; 
          padding: 1rem;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .email-body strong {
          font-weight: bold;
        }

        .email-body-h2{
          text-align: center;
          color: red;
        }
        .email-footer{
          padding: .5rem;
          background-color: #B22222;
          color: rgb(237, 237, 237); 
          text-align: center;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }

      </style>
    </head>
    <body>
      <div class="email-container">
        
            <div class="email-body">
              <div class="email-header">
                Rasheed Stationers
              </div>

              <h1>Your Order is on the Way!</h1>
              <p>Dear Customer,</p>
              <p>Thank you for visiting our Store!.</p>
              <p>Your Tracking id is:</p>
              <div class="email-body-h2"> 
                <h2>${trackingIdUpdated }</h2>
              </div>
              <p>Please use this Tracking id to track your order.</p>
              
              <div class="email-footer">
                <smaller>This is an automated email, please do not reply.</smaller>
              </div>
          </div>
  
      </div>
    </body>
  </html>
  `;

    await sendEmail({
      to: email,
      subject: 'Your Order Tracking ID',
      html: message,
    });

    console.log(`Tracking ID email sent to ${email}`);
  }
  catch(error){
    console.error('Error sending tracking email:', error);
    throw new Error('Failed to send tracking email');
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
  sendOrderVerificationEmail,
  sendTrackingIdEmail
};
