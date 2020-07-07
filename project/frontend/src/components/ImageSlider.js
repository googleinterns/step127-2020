import './ImageSlider.css';

import React, { useState, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';

import next from '../assets/next.svg';
import prev from '../assets/prev.svg';

function reducer(state, action) {
  const width = 344;

  switch (action.type) {
    case 'SWIPING': {
      const minLeft = (state.slideCount - 1) * -width;
      const dir = action.deltaX > 0 ? 'right' : 'left';

      let newLeft;
      if (
        (dir === 'left' && state.left <= minLeft) ||
        (dir === 'right' && state.left >= 0)
      ) {
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
        if (
          Math.abs(state.left) % width > width / 2 ||
          action.velocity >= 0.5
        ) {
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
        if (
          width - (Math.abs(state.left) % width) > width / 2 ||
          action.velocity >= 0.5
        ) {
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
    case 'PREV_SLIDE': {
      const newSlide = (state.slide > 0) ? state.slide - 1 : state.slide;
      const newLeft = newSlide * -width;
      return {
        left: newLeft,
        lastLeft: newLeft,
        slide: newSlide,
        slideCount: state.slideCount,
        shifting: true,
      };
    }
    case 'NEXT_SLIDE': {
      const newSlide = (state.slide < state.slideCount - 1) ? state.slide + 1 : state.slide;
      const newLeft = newSlide * -width;
      return {
        left: newLeft,
        lastLeft: newLeft,
        slide: newSlide,
        slideCount: state.slideCount,
        shifting: true,
      };
    }
    default: {
      throw new Error();
    }
  }
}

function ImageSlider(props) {
  const [areControlsVisible, setAreControlsVisible] = useState(false);
  
  const [state, dispatch] = useReducer(reducer, {
    left: 0,
    lastLeft: 0,
    slide: 0,
    slideCount: props.images.length,
  });

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      dispatch({ type: 'SWIPED_LEFT', velocity: event.velocity });
    },
    onSwipedRight: (event) => {
      dispatch({ type: 'SWIPED_RIGHT', velocity: event.velocity });
    },
    onSwiping: (event) => {
      dispatch({ type: 'SWIPING', deltaX: -event.deltaX });
    },
    delta: 5,
    trackTouch: true,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div
      className='slider'
      onMouseEnter={() => setAreControlsVisible(true)}
      onMouseLeave={() => setAreControlsVisible(false)}>
      <div
        className={`slider-wrapper ${state.shifting ? 'shifting' : ''}`}
        style={{ left: state.left + 'px' }}
        {...handlers}>
        {props.images.map((image) => (
          <span key={image} className='slide'>
            {image}
          </span>
        ))}
      </div>
      <img
        src={prev}
        className='control prev'
        style={{ opacity: areControlsVisible ? '1' : '0' }}
        onClick={() => dispatch({type: 'PREV_SLIDE'})}
      />
      <img
        src={next}
        className='control next'
        style={{ opacity: areControlsVisible ? '1' : '0' }}
        onClick={() => dispatch({type: 'NEXT_SLIDE'})}
      />
    </div>
  );
}

export default ImageSlider;
