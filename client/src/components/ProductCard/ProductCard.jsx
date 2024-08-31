import React from 'react';
import '../../css/productcard.css'

function ProductCard(props) {
  return (
    <div className="product-card">
      <img
        src={`http://localhost:8080/${props.images}`}
        alt={props.name}

      />
      <p className='product-title'>{props.name}</p>
      <p className='product-price'>Rs.{props.price}</p>
    </div>
  );
}

export default ProductCard;
