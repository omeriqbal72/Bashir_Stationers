import React from 'react';
import Header from '../Header/Header.jsx'// Assuming your header is in this path
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* This is where the public routes will be rendered */}
      </main>
    </div>
  );
};

export default PublicLayout;
