import React from 'react';
import ProductCard from './ProductCard.jsx';
import '../css/homeproductssection.css'
import Img from '../Ui_Images/home-banner-img2.jpg'
import Img1 from '../Ui_Images/home-banner-img4.jpg'

function HomeProductsSection() {
  const products = [
    { id: 1, image: Img1, title: 'Watercolor Kit For Beginners', price: '$970.00' },
    { id: 2, image: Img, title: 'Pastel Brush Tip Pens - Pack Of 8', price: '$970.00' },
    { id: 3, image: Img1, title: 'Watercolor Kit', price: '$970.00' },
    { id: 4, image: Img, title: 'Water Bottle', price: '$970.00' }
    
  ];

  return (
    <div className="best-selling-section">
      <h2>Our Top Picks</h2>
      <p>Essential Office Supplies In Our Online Stationery Shop That Keep Your Office Operations Smooth And Efficient</p>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeProductsSection;
