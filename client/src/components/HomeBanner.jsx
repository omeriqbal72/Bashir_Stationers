import React from 'react';
import '../css/homebanner.css';
import BannerImg3 from '../Ui_Images/home-banner-img3.jpg'
import BannerImg4 from '../Ui_Images/home-banner-img4.jpg'

const HomeBanner = () => {

    return (
        <div className="home-banner-container">
            <div className='home-banner-img1'>
                <div className='home-banner-img1-div'>
                    <button className='home-banner-btn'>Office Supplies</button>
                </div>
            </div>
            <div className='home-banner-img2'>
            <div className='home-banner-img2-div'>
                    <button className='home-banner-btn'>Art Supplies</button>
                </div>
            </div>
            <div className='home-banner-inside-container'>
                <div className='home-banner-img3'>
                    <img src={BannerImg3} alt="" />
                </div>
                <div className='home-banner-img4'>
                    <img src={BannerImg4} alt="" />
                </div>
            </div>

        </div>

    )
};

export default HomeBanner;