import React from 'react';
import '../../css/homebrandslider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar, A11y , Pagination} from 'swiper/modules';
import { Link } from 'react-router-dom';

import Dux from '../../Ui_Images/dux.png';
import Dollar from '../../Ui_Images/dollar.png';
import MontMarte from '../../Ui_Images/mont-marte.png';
import Deer from '../../Ui_Images/deer-logo.png';
import Piano from '../../Ui_Images/piano.png';
import Parker from '../../Ui_Images/parker.png';
import Deli from '../../Ui_Images/deli.png';
import Casio from '../../Ui_Images/casio.png';
import Pelican from '../../Ui_Images/pelikan.png';

const brandImages = [
    { src: Dux, alt: 'Dux Brand', name: 'Dux' },
    { src: Dollar, alt: 'Dollar Brand', name: 'Dollar' },
    { src: Deer, alt: 'Deer Brand', name: 'Deer' },
    
    { src: MontMarte, alt: 'Mont Brand', name: 'Mont Marte' },
    { src: Piano, alt: 'Piano Brand', name: 'Piano' },
    { src: Parker, alt: 'Parker Brand', name: 'Parker' },
    
    { src: Pelican, alt: 'Pelican Brand', name: 'Pelican' },
    { src: Casio, alt: 'Casio Brand', name: 'Casio' },
    { src: Deli, alt: 'Deli Brand', name: 'Deli' },
    
];

const HomeBrandSlider = () => {
    return (
        <div className="brand-logo-section">
            <div className="brand-logo-header">
                <h2>Our Trusted Brands</h2>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
                spaceBetween={5}
                breakpoints={{
                    500:{
                        slidesPerView: 2,
                    },
                    640: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                    1280: {
                        slidesPerView: 5,
                    },
                }}
                autoplay={{ delay: 0, disableOnInteraction: false }}
                speed={1500}
                loop={true}
                freeMode={true}
                className="brand-logo-slider"
            >
                {brandImages.map((brand, index) => (

                    <SwiperSlide key={index}>
                        <div className="home-brand-slider-item">
                            <Link to={`/products?company=${encodeURIComponent(brand.name)}`}>
                                <img src={brand.src} alt={brand.alt} />
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HomeBrandSlider;
