import './RestaurantCard.css';

import React from 'react';

import ImageSlider from './ImageSlider.js';
import RatingStars from './RatingStars.js';

import Place from '../assets/place.svg';
import Globe from '../assets/globe.svg';
import Phone from '../assets/phone.svg';
import Clock from '../assets/clock.svg';

/**
 * A card displaying a restaurant's basic information.
 *
 * @param {!Object<string, *>} props.restaurant An object containing basic restaurant
 *     information.
 * @param {!Object<string, *>} props.details An object containing detailed restaurant
 *     information.
 */
function RestaurantCard(props) {
  const { restaurant, details } = props;

  const photoUrls = details.result.photos.map(
    (photo) =>
      'https://maps.googleapis.com/maps/api/place/photo?photoreference=' +
      photo.photo_reference +
      '&key=AIzaSyC0Q4CyO-BM4M5jPvL3ayJ09RfymZYQjhs&maxwidth=344'
  );

  return (
    <div className='restaurant-card'>
      <ImageSlider images={photoUrls} />
      <div className='restaurant-content'>
        <h5 className='restaurant-name'>{restaurant.key.name}</h5>
        <RatingStars
          avgRating={restaurant.key.avgRating}
          numRatings={restaurant.key.numRatings}
        />
        <p className='restaurant-type'>
          {'$'.repeat(restaurant.key.priceLevel)} •{' '}
          {restaurant.key.placeTypes.join(', ')}
        </p>
        <div className='restaurant-detail-container'>
          <img src={Clock} alt='Clock icon' />
          <span>
            {details.result.opening_hours.open_now ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Place} alt='Place marker icon' />
          <span>{restaurant.key.address}</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Globe} alt='Globe icon' />
          <span>{details.result.website}</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Phone} alt='Phone icon' />
          <span>{details.result.formatted_phone_number}</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
