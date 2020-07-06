import './RestaurantCard.css';

import React, { useState, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';

import Star from '../assets/star.svg';
import HalfStar from '../assets/star_half.svg';
import EmptyStar from '../assets/star_border.svg';
import Place from '../assets/place.svg';
import Globe from '../assets/globe.svg';
import Next from '../assets/next.svg';
import Prev from '../assets/prev.svg';

const initialState = {
  left: 0,
  lastLeft: 0,
  slide: 0,
};

function reducer(state, action) {
  const width = 344;

  switch (action.type) {
  case 'SWIPING': {
    const minLeft = (state.slideCount - 1) * -width;
    const dir = (action.deltaX > 0) ? 'right' : 'left';

    let newLeft;
    if ((dir === 'left' && state.left <= minLeft) ||
        (dir === 'right' && state.left >= 0)) {
      newLeft = state.left;
    } else {
      newLeft = state.lastLeft + action.deltaX;
    }
    
    return {
      left: newLeft,
      lastLeft: state.lastLeft,
      slide: state.slide,
      slideCount: state.slideCount,
    };
  }
  case 'SWIPED_LEFT': {
    let newSlide = state.slide;
    if (newSlide < state.slideCount - 1) {
      if (Math.abs(state.left) % width > width / 2 ||
          action.velocity >= 0.5) {
        newSlide++;
      }
    }
    
    const newLeft = newSlide * -width;
    return {
      left: newLeft,
      lastLeft: newLeft,
      slide: newSlide,
      slideCount: state.slideCount,
      shifting: true,
    };
  }
  case 'SWIPED_RIGHT': {
    let newSlide = state.slide;
    if (newSlide > 0) {
      if (width - (Math.abs(state.left) % width) > width / 2 ||
          action.velocity >= 0.5) {
        newSlide--;
      }
    }
    
    const newLeft = newSlide * -width;
    return {
      left: newLeft,
      lastLeft: newLeft,
      slide: newSlide,
      slideCount: state.slideCount,
      shifting: true,
    };
  }
  default:
    throw new Error();
  }
}

function ImageSlider(props) {
  const images = props.images;

  const [state, dispatch] = useReducer(reducer, {...initialState, slideCount: images.length});

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      dispatch({type: 'SWIPED_LEFT', velocity: event.velocity});
    },
    onSwipedRight: (event) => {
      dispatch({type: 'SWIPED_RIGHT', velocity: event.velocity});
    },
    onSwiping: (event) => {
      dispatch({type: 'SWIPING', deltaX: -event.deltaX});
    },
    delta: 5,
    trackTouch: true,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  const [areControlsVisible, setAreControlsVisible] = useState(false);

  const toggleControls = (visible) => {
    setAreControlsVisible(visible);
  };
  
  return (
    <div
      className='slider'
      onMouseEnter={() => toggleControls(true)}
      onMouseLeave={() => toggleControls(false)}>
      <div
        className={`slider-wrapper ${state.shifting ? 'shifting' : ''}`}
        style={{left: state.left + 'px'}}
        {...handlers}>
        {images.map((image) => <span key={image} className='slide'>{image}</span>)}
      </div>
      <img
        src={Prev}
        className='control prev'
        style={{opacity: areControlsVisible ? '1' : '0'}}/>
      <img
        src={Next}
        className='control next'
        style={{opacity: areControlsVisible ? '1' : '0'}}/>
    </div>
  );
}

function RatingStars(props) {
  return (
    <div className='rating-stars-container'>
      <img src={Star} width='15' height='15'/>
      <img src={Star} width='15' height='15'/>
      <img src={Star} width='15' height='15'/>
      <img src={Star} width='15' height='15'/>
      <img src={Star} width='15' height='15'/>
      <span>4.5 (213)</span>
    </div>
  );
}

function RestaurantCard(props) {
  const images = [
    'Slide 1',
    'Slide 2',
    'Slide 3',
    'Slide 4',
    'Slide 5',
  ];
  
  return (
    <div className='restaurant-card'>
      <ImageSlider images={images}/>
      <div className='restaurant-content'>
        <h5 className='restaurant-name'>Cafe Badilico</h5>
        <RatingStars />
        <p className='restaurant-type'>$$ • Italian, Cafe</p>
        <div className='restaurant-detail-container'>
          <img src={Place}/>
          <span>123 Pinewood Street, Atlanta GA, 30022</span>
        </div>
        <div className='restaurant-detail-container'>
          <img src={Globe}/>
          <span>https://restaurantwebsite.com</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
