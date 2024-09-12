import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/productcard.css';

function ProductCard({ id, images, name, price }) {
  console.log('ProductCard Props:', { id, images, name, price });

  return (
    <Link to={`/product?id=${encodeURIComponent(id)}`}>
      <div className="product-card">
        <img
          src={`http://localhost:8080/${images || 'default-placeholder.png'}`}
          alt={name}
        />
        <p className='product-title'>{name}</p>
        <p className='product-price'>Rs.{price}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
