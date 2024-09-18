import React from 'react';
import Header from '../Header/Header.jsx';
import WhatsappLink from '../WhatsappLink/WhatsappLink.jsx'; // Assuming your header is in this path
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';
import '../../css/publiclayout.css'; // Ensure this path is correct

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Header className="header" />
      <WhatsappLink/>
      <main>
        <Outlet /> {/* This is where the public routes will be rendered */}
      </main>
      <Footer className="footer" />
    </div>
  );
};

export default PublicLayout;
