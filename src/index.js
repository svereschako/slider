import React from 'react';
import ReactDOM from 'react-dom';
import carouselSlidesData from './carouselSlidesData'
import Carousel from './components/Carousel'

const carouselContainer = document.querySelector(".carousel-container");

// Render Carousel component
ReactDOM.render(<Carousel slides={carouselSlidesData} />, carouselContainer);
