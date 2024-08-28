import React from "react";
import "../../css/homeslidersection.css";
import SliderImg1 from '../../Ui_Images/home-slider-pens.jpg'
import SliderImg2 from '../../Ui_Images/home-slider-notebook.jpg'
import SliderImg3 from '../../Ui_Images/home-slider-staplers.jpeg'
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
        autoplay={{ delay: 1000, disableOnInteraction: false }} 
        loop={true}>
        <SwiperSlide>
          <div className="slider-item">
            <img src={SliderImg1} alt="Books & Stationery" />
            <div className="slider-text">Pens</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={SliderImg2} alt="Books & Stationery" />
            <div className="slider-text">Books & Stationery</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={SliderImg3} alt="Staplers" />
            <div className="slider-text">Staplers</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={SliderImg2} alt="Books & Stationery" />
            <div className="slider-text">Books & Stationery</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={SliderImg1} alt="Books & Stationery" />
            <div className="slider-text">Books & Stationery</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src={SliderImg3} alt="Books & Stationery" />
            <div className="slider-text">Books & Stationery</div>
          </div>
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>
    );
  }
};

export default HomeSliderSection;
