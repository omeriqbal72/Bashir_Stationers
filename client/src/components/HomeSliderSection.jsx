import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/homeslidersection.css";
import Img1 from '../Ui_Images/home-banner-img1.jpg'
import Img2 from '../Ui_Images/home-banner-img2.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const HomeSliderSection = () => {
  return (
    <div className="slider-section">
      <h2>Shop By Categories</h2>
      <p>Essential Office Supplies In Our Online Stationery Shop...</p>
      <button className="all-collections-btn">All Collections</button>
      <div className="slider-container">
        <MySlider />
      </div>
    </div>
  );

  function MySlider() {
    return (
      <Swiper modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
        spaceBetween={10}
        slidesPerView={4}
        autoplay={{ delay: 750, disableOnInteraction: false }} // Configure autoplay settings
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop = {true}>
        <SwiperSlide>
          <div className="slider-item">
            <img src={Img2} alt="Books & Stationery" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={Img2} alt="Books & Stationery" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={Img2} alt="Books & Stationery" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={Img2} alt="Books & Stationery" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={Img2} alt="Books & Stationery" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={Img2} alt="Books & Stationery" />
          </div>
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>
    );
  }
};

export default HomeSliderSection;
