// SimilarProductsSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import ProductCard from './ProductCard';

const SimilarProductSlider = ({ products, isLoading, isError, error }) => {
    if (isLoading) {
        return <div>Loading similar products...</div>;
    }

    if (isError) {
        return <div>Error fetching similar products: {error.message}</div>;
    }

    if (!products || products.length === 0) {
        return <div>No similar products available.</div>;
    }

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
            spaceBetween={20}
            slidesPerView={4}
            autoplay={{ delay: 3000 }}
            navigation
        >
            {products.map((product) => (
                <SwiperSlide key={product.id}>
                    <ProductCard
                        key={product._id}
                        id={product._id}
                        images={product.images?.[0]}
                        name={product.name}
                        price={product.price}
                        company={product.company.name}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SimilarProductSlider;
