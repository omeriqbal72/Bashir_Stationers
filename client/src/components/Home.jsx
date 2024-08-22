import React from 'react';
import '../css/home.css';
import HomeBanner from './HomeBanner.jsx';
import HomeSliderSection from './HomeSliderSection.jsx';
import HomeProducts from './HomeProductsSection.jsx';

const Home = () => {

  return (
    <>
      <div className="home-main">
        <div className='home-main-intro'>
          <div className='home-main-intro-description'>
            <h2>Rasheed Stationers</h2>
            <p className='home-main-intro-description-tagline'>Authenticity in Every Pen Stroke.</p>
            <p className='home-main-intro-description-p'>Rasheed Stationers is your go-to source for genuine, top-brand stationery products in Pakistan’s wholesale market. We provide a wide selection of high-quality items, ensuring reliability and authenticity in every purchase.</p>
          </div>
          <div className='home-main-illustration'></div>
        </div>

        <HomeBanner />
        <HomeSliderSection />
        <HomeProducts />
      </div>
    </>
  );
};

export default Home;
