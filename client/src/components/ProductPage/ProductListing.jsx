import React from 'react';
import '../../css/productlisting.css'
import ProductCard from '../ProductCard/ProductCard.jsx';
import Img from '../../Ui_Images/home-banner-img2.jpg'

function ProductListing() {
    const products = [
        { id: 1, image: Img, title: 'Watercolor Kit For Beginners', price: '970.00' },
        { id: 2, image: Img, title: 'Pastel Brush Tip Pens - Pack Of 8', price: '970.00' },
        { id: 3, image: Img, title: 'Watercolor Kit', price: '970.00' },
        { id: 4, image: Img, title: 'Water Bottle', price: '970.00' },
        { id: 1, image: Img, title: 'Watercolor Kit For Beginners', price: '970.00' },
        { id: 2, image: Img, title: 'Pastel Brush Tip Pens - Pack Of 8', price: '970.00' },
        { id: 3, image: Img, title: 'Watercolor Kit', price: '970.00' },
        { id: 4, image: Img, title: 'Water Bottle', price: '970.00' }
        
      ];

    return (
        <div className="product-list">
            <h3>Search Results(56)</h3>
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

export default ProductListing;
