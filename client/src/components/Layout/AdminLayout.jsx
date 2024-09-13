import React from 'react';
import AdminSidebar from '../Admin/AdminSideBar.jsx';
import { Outlet } from 'react-router-dom';
import '../../css/adminlayout.css'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="admin-layout-sidebar">
        <AdminSidebar /> {/* Sidebar visible on all admin pages */}
      </div>

      <main className="admin-content">
        <Outlet /> {/* This is where the admin routes will be rendered */}
      </main>
    </div>
  );
};

export default AdminLayout;
