import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/productcard.css'

function ProductCard(props) {
  return (

    <Link to={`/product?id=${encodeURIComponent(props.id)}`}>
      <div className="product-card">
        <img
          src={`http://localhost:8080/${props.images}`}
          alt={props.name}
        />
        <p className='product-title'>{props.name}</p>
        <p className='product-price'>Rs.{props.price}</p>
      </div>
    </Link>

  );
}

export default ProductCard;
