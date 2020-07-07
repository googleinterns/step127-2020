import './RestaurantCard.css';

import React from 'react';

import ImageSlider from './ImageSlider.js';

import Star from '../assets/star.svg';
import HalfStar from '../assets/star_half.svg';
import EmptyStar from '../assets/star_border.svg';
import Place from '../assets/place.svg';
import Globe from '../assets/globe.svg';
import Phone from '../assets/phone.svg';
import Clock from '../assets/clock.svg';

function RatingStars(props) {
  const stars = [];
  for (let average = props.avgRating; average > 0; average--) {
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
      <span>{props.avgRating} ({props.numRatings})</span>
    </div>
  );
}

function RestaurantCard(props) {
  const restaurant = props.restaurant;
  const details = props.details;
  
  const images = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

  return (
    <div className='restaurant-card'>
      <ImageSlider images={images} />
      <div className='restaurant-content'>
        <h5 className='restaurant-name'>{restaurant.key.name}</h5>
        <RatingStars
          avgRating={restaurant.key.avgRating}
          numRatings={restaurant.key.numRatings}
        />
        <p className='restaurant-type'>
          {'$'.repeat(restaurant.key.priceLevel)} • {restaurant.key.placeTypes.join(', ')}
        </p>
        <div className='restaurant-detail-container'>
          <img src={Clock} />
          <span>{details.result.opening_hours.open_now ? 'Open' : 'Closed'}</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Place} />
          <span>{restaurant.key.address}</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Phone} />
          <span>{details.result.formatted_phone_number}</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Globe} />
          <span>{details.result.website}</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
