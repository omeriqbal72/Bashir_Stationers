import React from 'react';
import '../../css/productpage.css'
import ProductSidebar from './ProductSidebar.jsx';
import ProductListing from './ProductListing.jsx';

const ProductPage = () => {

    return (
        <>
            <div className="product-page">
                <div className="product-page-sidebar">
                    <ProductSidebar />
                </div>
                <div className="product-page-listing">
                    <ProductListing />
                </div>
            </div>

        </>
    );
};

export default ProductPage;
