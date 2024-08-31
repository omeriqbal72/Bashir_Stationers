import React, { useState, useEffect } from 'react';
import '../../css/productlisting.css'
import ProductCard from '../ProductCard/ProductCard.jsx';
import Img from '../../Ui_Images/home-banner-img2.jpg'
import axios from 'axios';


function ProductListing() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Replace the URL with your actual API endpoint
        axios.get('/get-products')
            .then(response => {
                setProducts(response.data);
                //console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="product-list">
            <h3>Search Results({products.length})</h3> {/* Update the count dynamically */}
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        images={product.images[0]}  // Ensure that your API provides the correct image URL
                        name={product.name}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProductListing;
