import React from 'react';
import { Carousel  } from 'antd';
import '../../css/home/homeoffers.css' 

const HomeOffers = () => {
  return (
    <div className="offer-slider">
      <Carousel 
        
        dots={false}          
        infinite={true}      
        speed={7000}        
      >
        <div>
          <span className="offer-text">🎉 40% off on all stationery! Valid till October 31st! 🎉</span>
        </div>
        <div>
          <span className="offer-text">📚 Buy 1 Get 1 Free on selected books! Hurry! Limited time offer! 📚</span>
        </div>
        <div>
          <span className="offer-text">🖊️ Special discount on pens! Flat 20% off. Offer ends soon! 🖊️</span>
        </div>
        {/* Add more offers as needed */}
      </Carousel>
    </div>
  );
};

export default HomeOffers;
