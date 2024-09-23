const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        // html: options.html, // Optional: HTML version
    };

    try {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = sendEmail;
