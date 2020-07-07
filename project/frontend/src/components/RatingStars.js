import './RatingStars.css';

import React from 'react';

import Star from '../assets/star.svg';
import HalfStar from '../assets/star_half.svg';
import EmptyStar from '../assets/star_border.svg';

/**
 * A small restaurant rating display showing a list of star icons, an average
 * rating value, and the number of total ratings.
 *
 * @param {number} props.avgRating The average rating value.
 * @param {number} props.numRatings The number of total ratings.
 */
function RatingStars(props) {
  const { avgRating, numRatings } = props;

  const stars = [];
  for (let average = avgRating; average > 0; average--) {
    stars.push(average >= 1 ? 1 : 0.5);
  }
  while (stars.length < 5) {
    stars.push(0);
  }

  return (
    <div className='rating-stars-container'>
      {stars.map((star, index) => (
        <img
          key={index}
          src={star === 1.0 ? Star : star === 0.5 ? HalfStar : EmptyStar}
          width='15'
          height='15'
          alt='Rating star'
        />
      ))}
      <span>
        {avgRating} ({numRatings})
      </span>
    </div>
  );
}

export default RatingStars;
