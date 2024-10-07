import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import WhatsappLink from '../WhatsappLink/WhatsappLink.jsx';
import Footer from '../Footer/Footer.jsx';
import { Outlet } from 'react-router-dom';
import '../../css/publiclayout.css'; // Ensure this path is correct

const PublicLayout = () => {
  const location = useLocation();

  // Condition to hide the header, footer, and WhatsApp link on the checkout page
  const hideHeaderFooter = location.pathname === '/order-summary';

  return (
    <div className="public-layout">
      {!hideHeaderFooter && <Header className="header" />}
      {!hideHeaderFooter && <WhatsappLink />}
      <main>
        <Outlet /> {/* This is where the public routes will be rendered */}
      </main>
      {!hideHeaderFooter && <Footer className="footer" />}
    </div>
  );
};

export default PublicLayout;
