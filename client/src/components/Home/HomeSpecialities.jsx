import React from 'react'
import '../../css/home/homespeciality.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import ProductCard from '../Product/ProductCard.jsx';
import PensHomeSpeciality2 from '../../Ui_Images/PensHomeSpeciality2.jpg'
import ArtHomeSpeciality2 from '../../Ui_Images/ArtHomeSpeciality2.jpeg'
import SchoolHomeSpeciality2 from '../../Ui_Images/SchoolHomeSpeciality2.jpeg'
import { Link } from 'react-router-dom';

import { useHomeSpecialities } from '../../Functions/GetAPI.js';
import Loader from '../Loader/Loader.jsx';

const HomeSpecialities = () => {
    const { data: categories, isLoading, isError, error } = useHomeSpecialities();

    const categoryImages2 = {
        'Art Tools': ArtHomeSpeciality2,
        'Writing Tools': PensHomeSpeciality2,
        'School Supplies': SchoolHomeSpeciality2
    };

    if (isLoading) {
        return <Loader height={100} />;
    }

    // Display error state with proper logging
    if (isError) {
        console.error('Error fetching home specialities:', error);
        return <div>Error loading home specialities</div>;
    }
    return (
        <div className="home-specialities-container">
            {categories.map((category) => (
                <div key={category._id} className="home-speciality-category-section">

                    <div className="home-speciality-image-container">
                        <img
                            src={categoryImages2[category.name] || HomePensSpeciality}
                            alt={category.name}
                            className="home-speciality-category-image" // Add a class for styling
                        />
                        <h3 className='home-speciality-category-title1'> </h3>
                        <h2 className='home-speciality-category-title2'>{category.name}</h2>
                        <button className='home-speciality-button'>
                            <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                                See {category.name.toUpperCase()} ➔
                            </Link></button>
                    </div>

                    <div className="home-specialities-bottom">
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={25}
                            slidesPerView="auto"
                            navigation

                            loop={false}
                            style={{ overflow: 'visible' }}
                        >
                            {category.products.map((product) => (
                                <SwiperSlide key={product._id} style={{ width: '300px' }}>
                                    <ProductCard
                                        id={product._id}
                                        images={product.images?.[0]}
                                        name={product.name}
                                        price={product.price}
                                        company={product.company.name}
                                        quantity={product.quantity}
                                        averageRating={product.averageRating}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HomeSpecialities