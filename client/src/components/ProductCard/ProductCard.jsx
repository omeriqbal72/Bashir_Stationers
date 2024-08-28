import React from 'react';
import '../../css/productcard.css'

function ProductCard(props) {
  return (
    <div className="product-card">
      <img src={props.image} alt={props.title} />
      <p className='product-title'>{props.title}</p>
      <p className='product-price'>Rs.{props.price}</p>
    </div>
  );
}

export default ProductCard;
