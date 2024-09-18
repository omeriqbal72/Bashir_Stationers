import React from 'react';
import WhatsAppIcon from '../../Ui_Images/whatsapp.png'
import '../../css/whatsapplink.css';
import { Link } from 'react-router-dom';

const WhatsappLink = () => {
    const phoneNumber = "923214027188"; // Add your WhatsApp number here

    return (

        <Link to={`https://wa.me/${phoneNumber}`} target='blank'>
            <div className="whatsapp-link">
                <img src={WhatsAppIcon} alt="WhatsApp" />
            </div>
        </Link>
    );
};


export default WhatsappLink;
