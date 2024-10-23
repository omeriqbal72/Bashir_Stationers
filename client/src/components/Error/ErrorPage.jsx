import React from 'react';
import '../../css/error/error.css'; // Make sure to add the CSS file
import errorgif from '../../Ui_Images/no-data.gif'
const ErrorPage = ({ message }) => {
    return (
        <div className="error-page-container">
            <div className="error-page-video">
                <img src={errorgif} alt="Error GIF" />
            </div>

            <div className="error-page-message">
                <h1>Oops! Something went wrong.</h1>
                <p>{message ? message : 'An unexpected error has occurred. Please try again later.'}</p>
            </div>
        </div>
    );
};

export default ErrorPage;
