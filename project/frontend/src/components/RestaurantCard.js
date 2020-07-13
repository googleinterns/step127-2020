import './RestaurantCard.css';

import React, { useRef, useLayoutEffect } from 'react';

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
 * @param {?Object<string, *>} props.style An optional style object to be applied
 *     to the parent container of this component.
 * @param {boolean=} props.collapsed An optional control over whether this card is in
 *     a collapsed or full view (default: false).
 */
function RestaurantCard(props) {
  const { restaurant, details, style, collapsed = false } = props;

  const photoUrls = details.result.photos.map(
    (photo) =>
      'https://maps.googleapis.com/maps/api/place/photo?photoreference=' +
      photo.photo_reference +
      '&key=' +
      process.env.REACT_APP_GOOGLE_API_KEY +
      '&maxwidth=344'
  );

  const collapsible = useRef(null);
  const collapsibleMaxHeight = useRef(null);
  const restaurantName = useRef(null);

  useLayoutEffect(() => {
    collapsibleMaxHeight.current = collapsible.current.offsetHeight;
    if (collapsed) {
      collapsible.current.style.height = '0px';
      restaurantName.current.classList.add('collapsed');
    } else {
      collapsible.current.style.height = collapsibleMaxHeight.current + 'px';
    }
    // We only want this effect to run once (the very first time this component
    // is laid out) so that we may capture the uncollapsed height of the collapsible
    // div within this card and save it to a persistent ref (collapsibleMaxHeight).
    // Adding `collapsed` to the dependency array below, as eslint would have us do,
    // would cause the value of `collapsibleMaxHeight` to be updated to 0px when the
    // card goes from a collapsed -> uncollapsed state.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On the first render event of this component, the collapsible elements will be
  // rendered with their default full heights (style.height = '') regardless of whether
  // `collapsed` is true or false. This allows the full height to be captured in the
  // above layoutEffect before this component is painted to the screen. The layoutEffect
  // also updates the collapsible elements height according to the value of `collapsed`
  // before painting so there is no flicker even though an initially collapsed card will
  // be first rendered at full height.
  //
  // This is all necessary to avoid hardcoding the maximum height of the collapsible
  // elements, as their height may vary due to word wrapping within the collapsible
  // elements (e.g. long addresses or website urls).
  return (
    <div className='restaurant-card' style={style}>
      <ImageSlider images={photoUrls} collapsed={collapsed} />
      <div className='restaurant-content'>
        <h5
          className={`restaurant-name ${
            collapsed && collapsibleMaxHeight.current ? 'collapsed' : ''
          }`}
          ref={restaurantName}>
          {restaurant.key.name}
        </h5>
        <RatingStars
          avgRating={restaurant.key.avgRating}
          numRatings={restaurant.key.numRatings}
        />
        <div
          ref={collapsible}
          className='restaurant-collapsible'
          style={{
            height: !collapsibleMaxHeight.current
              ? ''
              : collapsed
              ? '0px'
              : collapsibleMaxHeight.current + 'px',
          }}>
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
    </div>
  );
}

export default RestaurantCard;
