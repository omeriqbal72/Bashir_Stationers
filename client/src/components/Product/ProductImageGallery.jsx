import React, {useState} from 'react';
import '../../css/productimagegallery.css'
import img1 from '../../Ui_Images/whitechalks.jpg'
import img2 from '../../Ui_Images/colors.jpg'
import img3 from '../../Ui_Images/home-hero-bg.jpg'

const images = [
  img1, img2, img3
];

const ProductImageGallery = () => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="image-gallery">
      <div className="thumbnails">
        {images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`Thumbnail ${index + 1}`} 
            onClick={() => setMainImage(img)}
            className={img === mainImage ? 'active' : ''}
          />
        ))}
      </div>
      <div className="main-image">
        <img src={mainImage} alt="Main Product" />
      </div>
    </div>
  );
};

export default ProductImageGallery;
