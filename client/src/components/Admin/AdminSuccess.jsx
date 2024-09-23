import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;
  const { message, product } = state || {};

  // Trigger the toast notification on component mount
  useEffect(() => {
    if (message) {
      toast.success(message);  // Shows a success toast with the passed message
    }
  }, [message]);

  return (
    <div className="success-page">
      {/* ToastContainer just for this page */}
      <ToastContainer position="bottom-center" autoClose={3000} />
      
      {product && (
        <div className="product-details">
          <h2>Product Details</h2>
          <p><strong>Product Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> {product.price}</p>
          <p><strong>Stock:</strong> {product.quantity}</p>
        </div>
      )}
      
      <button onClick={() => navigate('/admin')}>Go to Admin Home</button>
    </div>
  );
};

export default AdminSuccess;
