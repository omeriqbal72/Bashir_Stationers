import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/adminSidebar.css';
import { useUserContext } from '../../context/UserContext.jsx'

const AdminSideBar = () => {
    const [showProducts, setShowProducts] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showCustomers, setShowCustomers] = useState(false);

    const { logout } = useUserContext();// Access logout function from context
    const navigate = useNavigate();

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

    const handleLogout = async (event) => {
        event.preventDefault(); // Prevent default link behavior
        await logout(); 
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <aside className="admin-sidebar">
            <h1>Rasheed Stationers</h1>
            <ul>
                <li><Link to="/admin">Home</Link></li>
                <li onClick={toggleProducts}>
                    <a href="#">Products</a>
                    {showProducts && (
                        <ul>
                            <li><Link to="/admin/manage-products">Manage Products</Link></li>
                            <li><Link to="/admin/add-product">Add Products</Link></li>
                        </ul>
                    )}
                </li>
                <li onClick={toggleOrders}>
                    <a href="#">Orders</a>
                    {showOrders && (
                        <ul>
                            <li><Link to="/admin/view-orders">View Orders</Link></li>
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
                        </ul>
                    )}
                </li>
                <li><a href="/" onClick={handleLogout}>Logout</a></li>
            </ul>
        </aside>
    );
};

export default AdminSideBar;
