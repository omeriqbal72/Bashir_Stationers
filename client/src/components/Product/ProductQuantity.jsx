import React from 'react';
import '../../css/productquantity.css';

const QuantitySelector = ({ quantity, onIncrement, onDecrement, isOutOfStock, disableIncrement, disableDecrement }) => {
  return (
    <div className="quantity-selector">
      <div className="quantity-controls">
        <button onClick={onDecrement} disabled={disableDecrement}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrement} disabled={disableIncrement}>+</button>
      </div>
    </div>
  );
};

export default QuantitySelector;
