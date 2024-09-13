import React, { useState } from 'react';
import '../../css/adminSidebar.css';
import { Link } from 'react-router-dom';

const AdminSideBar = () => {
    const [showProducts, setShowProducts] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showCustomers, setShowCustomers] = useState(false);

    const toggleProducts = () => {
        setShowProducts(!showProducts);
        setShowOrders(false);
        setShowCustomers(false);
    };

    const toggleOrders = () => {
        setShowOrders(!showOrders);
        setShowProducts(false);
        setShowCustomers(false);
    };

    const toggleCustomers = () => {
        setShowCustomers(!showCustomers);
        setShowProducts(false);
        setShowOrders(false);
    };

    return (
        <aside className="admin-sidebar">
            <ul>

                <li><a href="/admin">Home</a></li>
                <li onClick={toggleProducts}>
                    <a href="#">Products</a>
                    {showProducts && (
                        <ul>
                            <li><a href="/admin/manage-products">Manage Products</a></li>
                            <li><a href="/admin/add-product">Add Products</a></li>

                        </ul>
                    )}
                </li>
                <li onClick={toggleOrders}>
                    <a href="#">Orders</a>
                    {showOrders && (
                        <ul>
                            <li><a href="#">View Orders</a></li>
                            <li><a href="#">Process Orders</a></li>

                        </ul>
                    )}
                </li>
                <li onClick={toggleCustomers}>
                    <a href="#">Customers</a>
                    {showCustomers && (
                        <ul>
                            <li><a href="#">Customer List</a></li>
                            <li><a href="#">Manage Customers</a></li>
                            {/* Add other customer sub-menu items here */}
                        </ul>
                    )}
                </li>
                {/* Add other menu items here */}
            </ul>
        </aside>
    );
};

export default AdminSideBar;