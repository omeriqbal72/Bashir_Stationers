import React, { useState, useEffect } from 'react';
import '../css/home.css';
import homeBG from '../Ui_Images/home-main-bg.jpg'

const Home = () => {

  return (
    <>
      <div className="home-main">
        <div className='home-main-intro'>
          <div className='home-main-intro-description'>
            <h2>Bashir Stationers</h2>
            <p className='home-main-intro-description-tagline'>Authenticity in Every Pen Stroke.</p>
            <p className='home-main-intro-description-p'>Bashir Stationers is your go-to source for genuine, top-brand stationery products in Pakistan’s wholesale market. We provide a wide selection of high-quality items, ensuring reliability and authenticity in every purchase.</p>
          </div>
          <div className='home-main-illustration'></div>
        </div>






        <div class="banner-container">
          <div class="main-banner">
            <div class="banner-content">
              <h2>Mix & Match</h2>
              <p>With Our 3 For 2 Stationery</p>
            </div>
          </div>
          <div class="side-banners">
            <div class="side-banner metal-pens">
              <div class="banner-content">
                <h3>Metal Pens</h3>
                <p>15% Off</p>
              </div>
            </div>
            <div class="side-banner tape">
              <div class="banner-content">
                <h3>Tape</h3>
                <p>From $12.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
