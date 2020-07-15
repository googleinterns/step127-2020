import './RestaurantCard.css';

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';

import PlacesApiContext from '../contexts/PlacesApiContext.js';

import ImageSlider from './ImageSlider.js';
import RatingStars from './RatingStars.js';

import Place from '../assets/place.svg';
import Globe from '../assets/globe.svg';
import Phone from '../assets/phone.svg';
import Clock from '../assets/clock.svg';

function nthIndexOf(haystack, needle, n) {
  let i = -1;
  while (n--) {
    i = haystack.indexOf(needle, ++i);
    if (i < 0) break;
  }
  return i;
}

const bannedTags = ['food', 'point_of_interest', 'establishment'];
function prettifyTags(tags) {
  const out = [];
  for (let tag of tags) {
    if (!bannedTags.includes(tag)) {
      tag = tag.replace('meal_', '');
      out.push(tag);
    }
  }
  return out;
}

/**
 * A card displaying a restaurant's basic information.
 *
 * @param {!Object<string, *>} props.restaurant An object containing basic restaurant
 *     information.
 * @param {?Object<string, *>} props.style An optional style object to be applied
 *     to the parent container of this component.
 * @param {boolean=} props.collapsed An optional control over whether this card is in
 *     a collapsed or full view (default: false).
 */
function RestaurantCard(props) {
  const { restaurant, style, collapsed = false } = props;

  const [details, setDetails] = useState(null);

  const placesService = useContext(PlacesApiContext);
  
  useEffect(() => {
    const fields = [
      'url',
      'formatted_address',
      'formatted_phone_number',
      'international_phone_number',
      'photos',
      'website',
      'opening_hours',
      'name',
    ];
    placesService.getDetails(
      { placeId: restaurant.key.id, fields },
      (details) => {
        if (details) {
          setDetails({ result: details });
        }
      }
    );
  }, [placesService, restaurant.key.id]);
  
  const collapsible = useRef(null);
  const collapsibleMaxHeight = useRef(null);
  const imageSlider = useRef(null);
  const imageSliderMaxHeight = useRef(null);
  const restaurantName = useRef(null);

  useLayoutEffect(() => {
    // Temporarily update the collapsible divs to an uncollapsed state.
    imageSlider.current.style.transition = 'none';
    restaurantName.current.classList.remove('collapsed');
    collapsible.current.style.height = '';
    imageSlider.current.style.height = '200px';

    // Capture uncollapsed heights.
    collapsibleMaxHeight.current = collapsible.current.offsetHeight;
    imageSliderMaxHeight.current = imageSlider.current.offsetHeight;

    // Reset collapsible divs to their proper heights.
    if (collapsed) {
      collapsible.current.style.height = '0px';
      imageSlider.current.style.height = '0px';
      restaurantName.current.classList.add('collapsed');
    } else {
      collapsible.current.style.height = collapsibleMaxHeight.current + 'px';
      imageSlider.current.style.height = imageSliderMaxHeight.current + 'px';
    }

    // We need to calculate the offsetHeight of the imageSlider here so that
    // the following line adding the transition animation back to the imageSlider
    // does not get batched with the previous update to the imageSlider height
    // and cause an unwanted animation to play.
    // 
    // eslint-disable-next-line no-unused-vars
    const ignore = imageSlider.current.offsetHeight;
    imageSlider.current.style.transition = 'height 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)';
    
    // We only want this effect to run twice (the very first time this component
    // is laid out and when the details of this restaurant are updated) so that
    // we may capture the uncollapsed heights of the collapsible divs within this
    // card and save it to a persistent ref (collapsibleMaxHeight and imageSliderMaxHeight).
    // 
    // Adding `collapsed` to the dependency array below, as eslint would have us do,
    // would cause the value of `collapsibleMaxHeight` to be updated to 0px when the
    // card goes from a collapsed -> uncollapsed state and would cause this effect to
    // be run more than is necessary.
    //
    // This is all necessary to avoid hardcoding the maximum height of the collapsible
    // elements, as their height may vary due to word wrapping within the collapsible
    // elements (e.g. long addresses or website urls).
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const sliderStyle = {
    height: collapsed ? '0px' : imageSliderMaxHeight.current + 'px',
    transition: 'height 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)',
  };
  const photoUrls = details
    ? details.result.photos.map((photo) => photo.getUrl({ maxWidth: 344 }))
    : ['https://pixelpapa.com/wp-content/uploads/2018/11/26.gif'];

  const open = details
    ? details.result.opening_hours.isOpen()
      ? <span className='restaurant-open-text'>Open.</span>
      : <span className='restaurant-closed-text'>Closed.</span>
    : <span>loading</span>;

  const websiteFull = details ? details.result.website : 'loading';
  let website;
  if (websiteFull) {
    const end = nthIndexOf(websiteFull, '/', 3);
    if (end !== -1) {
      website = websiteFull.slice(0, end + 1);
    } else {
      website = websiteFull;
    }
  } else {
    website = 'unavailable :(';
  }

  const phone = details ? details.result.formatted_phone_number : 'loading';
  const internationalPhone = details ? details.result.international_phone_number : 'loading';

  const address = details ? details.result.formatted_address : 'loading';
  const googleUrl = details ? details.result.url : null;
  
  return (
    <div className='restaurant-card' style={style}>
      <ImageSlider parentRef={imageSlider} images={photoUrls} style={sliderStyle} />
      <div className='restaurant-content'>
        <div className='restaurant-header'>
          <h5
            className={`restaurant-name ${collapsed ? 'collapsed' : ''}`}
            ref={restaurantName}>
            {restaurant.key.name}
          </h5>
          <h5 className='restaurant-score'>
            {Math.round(restaurant.value * 100) + '%'}
          </h5>
        </div>
        <RatingStars
          avgRating={restaurant.key.avgRating}
          numRatings={restaurant.key.numRatings}
        />
        <div
          ref={collapsible}
          className='restaurant-collapsible'
          style={{ height: collapsed ? '0px' : collapsibleMaxHeight.current + 'px' }}>
          <p className='restaurant-type'>
            {'$'.repeat(Math.max(restaurant.key.priceLevel, 1))} •{' '}
            {prettifyTags(restaurant.key.placeTypes).join(', ')}
          </p>
          <div className='restaurant-detail-container'>
            <img src={Clock} alt='Clock icon' />
            {open}
          </div>
          <div className='restaurant-detail-container'>
            <img src={Place} alt='Place marker icon' />
            <span>
              <a href={googleUrl} target='_blank' rel='noopener noreferrer'>{address}</a>
            </span>
          </div>
          <div className='restaurant-detail-container'>
            <img src={Globe} alt='Globe icon' />
            <span className='restaurant-website'>
              <a href={websiteFull} target='_blank' rel='noopener noreferrer'>{website}</a>
            </span>
          </div>
          <div className='restaurant-detail-container'>
            <img src={Phone} alt='Phone icon' />
            <span>
              <a href={'tel:' + internationalPhone}>{phone}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
