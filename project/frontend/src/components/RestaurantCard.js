import './RestaurantCard.css';

import React from 'react';

import ImageSlider from './ImageSlider.js';

import Star from '../assets/star.svg';
import HalfStar from '../assets/star_half.svg';
import EmptyStar from '../assets/star_border.svg';
import Place from '../assets/place.svg';
import Globe from '../assets/globe.svg';

function RatingStars(props) {
  let average = '4.5'; // props.average;
  const numRatings = '213'; // props.numRatings;

  const stars = [];
  for (let average = '4.5'; average > 0; average--) {
    stars.push((average >= 1) ? 1 : 0.5);
  }
  while (stars.length < 5) {
    stars.push(0);
  }
  
  return (
    <div className='rating-stars-container'>
      {stars.map((star) => (
        <img
          src={(star === 1.0) ? Star : (star === 0.5) ? HalfStar : EmptyStar}
          width='15'
          height='15'
        />
      ))}
      <span>{average} ({numRatings})</span>
    </div>
  );
}

function RestaurantCard(props) {
  const images = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

  return (
    <div className='restaurant-card'>
      <ImageSlider images={images} />
      <div className='restaurant-content'>
        <h5 className='restaurant-name'>Cafe Badilico</h5>
        <RatingStars />
        <p className='restaurant-type'>$$ • Italian, Cafe</p>
        <div className='restaurant-detail-container'>
          <img src={Place} />
          <span>123 Pinewood Street, Atlanta GA, 30022</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Globe} />
          <span>https://restaurantwebsite.com</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
