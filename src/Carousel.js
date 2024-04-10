import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';

const Carousel = () => {
    const navigate = useNavigate();
    const [selectedTheme, setSelectedTheme] = useState('LocalNow');
  
    // Define an array of objects containing image URLs, theme names, and ASIN values
    const carouselItems = [
      { imageUrl: 'logo.png', theme: 'LocalNow', asin: 'ASIN1' },
      { imageUrl: 'logo.png', theme: 'TWC', asin: 'ASIN2' },
      { imageUrl: 'logo.png', theme: 'HBCUGO', asin: 'ASIN3' },
    ];
  
    // Function to handle click event on carousel item
    const handleClick = (theme, asin) => {
      // Set the selected theme
      setSelectedTheme(theme);
  
      // Reload the page with new theme and ASIN values using URL parameters
      navigate(`/?theme=${theme}&asin=${asin}`);
    };
  
    return (
      <div className={`carousel ${selectedTheme.toLowerCase()}`}>
        {/* Map through the carousel items and render clickable images */}
        {carouselItems.map((item, index) => (
          <img
            key={index}
            src={item.imageUrl}
            alt={`Theme ${index + 1}`}
            onClick={() => handleClick(item.theme, item.asin)}
            className="carousel-image"
          />
        ))}
      </div>
    );
};

export default Carousel;