import React from 'react';
import '../../css/home.css';
import HomeHero from './HomeHero.jsx';
import HomeBanner from './HomeBanner.jsx';
import HomeSliderSection from './HomeSliderSection.jsx';
import HomeBrandSlider from './HomeBrandSlider.jsx';
import HomeProducts from './HomeProductsSection.jsx';
import HomeIllustration from '../../Ui_Images/home-main-illustration.png'
import HomeIllustration2 from '../../Ui_Images/HomeImage2.png'
import HomeOffers from './HomeOffers.jsx';
import HomeSpecialities from './HomeSpecialities.jsx';
import HomeFooter from './HomeFooter.jsx';

const Home = () => {

  return (
    <>

      <div className="home-main">
        {/* <HomeOffers /> */}
        <div className='home-main-intro'>
          <div className='home-main-intro-description'>
            <h2>Rasheed Stationers</h2>
            <p className='home-main-intro-description-tagline'>Authenticity in Every Pen Stroke.</p>
            <p className='home-main-intro-description-p'>Rasheed Stationers is your go-to source for genuine, top-brand stationery products in Pakistan’s wholesale market. We provide a wide selection of high-quality items, ensuring reliability and authenticity in every purchase.</p>
          </div>
          <div className='home-main-illustration'>
            <img src={HomeIllustration} alt="" />
          </div>
          <div className="home-main-illustration-2">
            <img src={HomeIllustration2} alt="" />
          </div>
        </div>


        <HomeBanner />
        <HomeHero />
        <HomeSliderSection />
        <HomeProducts />
        <HomeSpecialities />
        <HomeFooter />
        <HomeBrandSlider />
      </div>
    </>
  );
};

export default Home;
