import React from "react";
import { Link } from 'react-router-dom';
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

  const slidesData = [
    { imgSrc: SliderImg1, category: "Writing Tools", altText: "Writing Tools" },
    { imgSrc: SliderImg2, category: "Art Tools", altText: "Art Tools" },
    { imgSrc: SliderImg3, category: "Binding Tools", altText: "Binding Tools" },
    { imgSrc: SliderImg1, category: "Writing Tools", altText: "Writing Tools" },
    { imgSrc: SliderImg3, category: "Binding Tools", altText: "Binding Tools" },
    { imgSrc: SliderImg2, category: "Art Tools", altText: "Art Tools" },
  ];

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
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        loop={true}
        navigation
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}

      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link to={`/products?category=${encodeURIComponent(slide.category)}`}>
              <div className="slider-item">
                <img src={slide.imgSrc} alt={slide.altText} />
                <div className="slider-text">{slide.category}</div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
        
      </Swiper>
    );
  }
};

export default HomeSliderSection;
