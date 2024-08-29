import React from 'react'
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { useState } from 'react';

const AdminPanel = () => {
    const [productList, setProductList] = useState([]);

  const handleProductAdded = (newProduct) => {
    setProductList([...productList, newProduct]);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ProductForm onProductAdded={handleProductAdded} />
      <ProductList products={productList} />
    </div>
  );
}

export default AdminPanel