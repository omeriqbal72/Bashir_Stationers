import React from 'react';
import '../../css/productquantity.css';

const QuantitySelector = ({ quantity, onIncrement, onDecrement }) => {
  return (
    <div className="quantity-selector">
      <div className="quantity-controls">
        <button onClick={onDecrement} disabled={quantity <= 1}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrement}>+</button>
      </div>
    </div>
  );
};

export default QuantitySelector;
