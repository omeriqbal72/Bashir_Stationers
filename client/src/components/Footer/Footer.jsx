import React from 'react';
import { Link } from 'react-router-dom';
import Waves from 'react-wavify';
import LineSpacer from '../Product/LineSpacer';
import '../../css/footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faHouse, faBoxOpen, faAddressCard, faAddressBook } from '@fortawesome/free-solid-svg-icons';


const Footer = () => {
    return (
        <footer className="footer">
            {/* The Wave */}
            <Waves
                fill="#DEF9C4"
                paused={false}
                options={{
                    height: 5,
                    amplitude: 30,
                    speed: 0.15,
                    points: 5
                }}
                className="footer-wave"
            />

            <div className='footer-container'>
                <div className="footer-content">
                    <div className='footer-company-section'>
                        <h1>About</h1>
                        <h2>Rasheed Stationers</h2>
                        <p>
                            Rasheed Stationers is your go-to source for genuine, top-brand stationery products
                            in Pakistan’s wholesale market. We provide a wide selection of high-quality items,
                            ensuring reliability and authenticity in every purchase.</p>
                    </div>

                    <div className='footer-links-section'>
                        <h1>Useful Links</h1>
                        <ul className='footer-links-list'>
                            <Link to={'/'}>
                                <li>
                                    <FontAwesomeIcon icon={faHouse} size="sm" />
                                    Home
                                </li>
                            </Link>

                            <Link to={'/products'}>
                                <li>
                                    <FontAwesomeIcon icon={faBoxOpen} size="sm" />
                                    Products
                                </li>
                            </Link>
                            <Link to={'/about'}>
                                <li>
                                    <FontAwesomeIcon icon={faAddressCard} size="sm" />
                                    About
                                </li>
                            </Link>

                            <li>
                                <FontAwesomeIcon icon={faAddressBook} size="sm" />
                                Contact
                            </li>
                        </ul>
                    </div>

                    <div className='footer-location-section'>
                        <h1>Locate Us</h1>
                        <div className='footer-location'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span>Shop# 728, Urdu Bazar Block 14, Lahore, 54000</span>
                        </div>

                        <div className='footer-location'>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>(+92) 3214027188</span>
                        </div>
                    </div>
                </div>

                <LineSpacer />

                <div className='footer-copyright'>
                    <span>© 2024 Rasheed Stationers. All Rights Reserved.
                    </span>
                </div>

            </div>


        </footer>
    );
};

export default Footer;
