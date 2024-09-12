import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import ProductCard from './ProductCard';
import SliderImg from '../../Ui_Images/home-slider-notebook.jpg'

function MySlider() {
    // Static data array for products
    const staticProducts = [
        {
            id: 1,
            name: 'Product 1',
            price: 1000,
            images: 'product1.jpg',
        },
        {
            id: 2,
            name: 'Product 2',
            price: 2000,
            images: 'product2.jpg',
        },
        {
            id: 3,
            name: 'Product 3',
            price: 3000,
            images: 'product3.jpg',
        },
        {
            id: 4,
            name: 'Product 4',
            price: 4000,
            images: 'product4.jpg',
        },
        {
            id: 5,
            name: 'Product 5',
            price: 5000,
            images: 'product5.jpg',
        },
        {
            id: 6,
            name: 'Product 6',
            price: 6000,
            images: 'product6.jpg',
        },
    ];

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
            spaceBetween={20}
            slidesPerView={4}
            autoplay={{ delay: 3000 }}
            navigation
        >
            {staticProducts.map((product) => (
                <SwiperSlide key={product.id}>
                    <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        images={'images-1725902617417-130522952.png'}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default MySlider;
