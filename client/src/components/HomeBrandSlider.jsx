import React from 'react';
import '../css/homebrandslider.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import Dux from '../Ui_Images/dux-logo.png';
import Dollar from '../Ui_Images/dollar-logo.png';
import Oro from '../Ui_Images/oro-logo.png';
import Deer from '../Ui_Images/deer-logo.png';


const HomeBrandSlider = () => {
    return (
        <div className="brand-logo-section">
            <div className="brand-logo-header">
                <h2>Our Trusted Brands</h2>
            </div>
            <Swiper
                modules={[Autoplay]}
                spaceBetween={10}
                slidesPerView={4}
                autoplay={{ delay: 0, disableOnInteraction: false }}
                speed={1500}// Configure autoplay settings
                loop={true}
                freeMode={true}
                className="brand-logo-slider"
            >
                <SwiperSlide>
                    <div className="slider-item">
                        <img src={Dux} alt="Books & Stationery" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slider-item">
                        <img src={Dollar} alt="Books & Stationery" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slider-item">
                        <img src={Oro} alt="Books & Stationery" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slider-item">
                        <img src={Deer} alt="Books & Stationery" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slider-item">
                        <img src={Dux} alt="Books & Stationery" />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default HomeBrandSlider;


