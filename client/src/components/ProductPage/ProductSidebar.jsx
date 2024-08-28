import React from 'react';
import '../../css/productsidebar.css'

function ProductSidebar() {
  return (
    <div className="sidebar">
      <h2>Filter</h2>
      {/* Add your filter options here */}
      <div className="filter-section">
        <h4>Brand</h4>
        {/* Brand Filters */}
      </div>
      <div className="filter-section">
        <h4>Price</h4>
        {/* Price Filters */}
      </div>
    </div>
  );
}

export default ProductSidebar;
