import './RestaurantRankingView.css';

import React, { forwardRef } from 'react';

import RatingStars from './RatingStars.js';

/**
 * A collection of color gradients that the bar of the RestaurantRankingView
 * component may adopt.
 *
 * @type {!Array<string>}
 */
const gradients = ['#D99EC9, #F6F0C4', '#BDD8FE, #D99EC9', '#FF8383, #BDD8FE'];

/**
 * A card displaying brief restaurant information with a bar indicating the fractional
 * interest of a swipe match group in the restaurant.
 *
 * @param {!Object<string, *>} props.restaurant An object containing basic restaurant
 *     information.
 */
const RestaurantRankingView = forwardRef((props, ref) => {
  const { restaurant } = props;

  return (
    <div ref={ref} className='swipe-match-restaurant-ranking-view'>
      <h5>{restaurant.key.name}</h5>
      <RatingStars
        avgRating={restaurant.key.avgRating}
        numRatings={restaurant.key.numRatings}
      />
      <div className='swipe-match-restaurant-ranking-bar-track'>
        <div
          className='swipe-match-restaurant-ranking-bar'
          style={{
            width: restaurant.fractionLiked * 100 + '%',
            backgroundImage:
              'linear-gradient(315deg, ' + gradients[restaurant.gradient] + ')',
          }}
        />
      </div>
    </div>
  );
});

export default RestaurantRankingView;
