import React, { useState, useEffect } from 'react';
import '../css/home.css';
import homeBG from '../Ui_Images/home-main-bg.jpg'

const Home = () => {
 
  return (
    <>
      <div className="home-main">
      <img className='home-main-bg-img' src={homeBG}/>
      </div>
    </>
  );
};

export default Home;
