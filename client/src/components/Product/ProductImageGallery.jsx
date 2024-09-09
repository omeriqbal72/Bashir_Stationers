import React, { useState, useEffect } from 'react';
import '../../css/productimagegallery.css';
import loadingImage from '../../Ui_Images/colors.jpg'; // Add a placeholder loading image
import fallbackImage from '../../Ui_Images/colors.jpg'; // Add a fallback image for missing products

const ProductImageGallery = ({ images = [] }) => {
  const [mainImage, setMainImage] = useState(loadingImage); // Start with a loading image
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(`http://localhost:8080/${images[0]}`); // Use first image as main image
      setIsLoading(false); // Stop loading once images are available
    } else {
      setMainImage(fallbackImage); // Fallback image if no images
      setIsLoading(false);
    }
  }, [images]);

  if (isLoading) {
    return <div>Loading images...</div>; // Display loading message
  }

  return (
    <div className="image-gallery">
      <div className="thumbnails">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img 
              key={index} 
              src={`http://localhost:8080/${img}`} // Use images from server
              alt={`Thumbnail ${index + 1}`} 
              loading="lazy" // Lazy loading for better performance
              onClick={() => setMainImage(`http://localhost:8080/${img}`)}
              className={mainImage === `http://localhost:8080/${img}` ? 'active' : ''}
            />
          ))
        ) : (
          <p>No images available</p> // Handle if no images
        )}
      </div>
      <div className="main-image">
        <img src={mainImage} alt="Main Product" />
      </div>
    </div>
  );
};

export default ProductImageGallery;