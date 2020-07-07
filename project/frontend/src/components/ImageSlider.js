import './ImageSlider.css';

import React, { useState, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';

import next from '../assets/next.svg';
import prev from '../assets/prev.svg';

function reducer(state, action) {
  const width = 344;

  switch (action.type) {
    case 'SWIPING': {
      const maxLeft = 0.0;
      const minLeft = (state.slideCount - 1) * -width;
      let newLeft = state.lastLeft + action.deltaX;
      newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

      let newSlide = state.slide;
      const dir = (action.deltaX > 0) ? 'right' : 'left';
      if (dir === 'left') {
        if (newLeft <= (state.slide + 1) * -width) {
          newSlide++;
        } else if (newLeft > state.slide * -width) {
          newSlide--;
        }
      } else {
        if (newLeft >= (state.slide - 1) * -width) {
          newSlide--;
        } else if (newLeft < state.slide * -width) {
          newSlide++;
        }
      }
      
      return {
        left: newLeft,
        lastLeft: state.lastLeft,
        slide: newSlide,
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

  const handleSwipedUpOrDown = (event) => {
    if (event.deltaX > 0) {
      dispatch({ type: 'SWIPED_LEFT', velocity: 0 });
    } else {
      dispatch({ type: 'SWIPED_RIGHT', velocity: 0 });
    }
  };

  const handlers = useSwipeable({
    onSwiping: (event) => {
      dispatch({ type: 'SWIPING', deltaX: -event.deltaX });
    },
    onSwipedLeft: (event) => {
      dispatch({ type: 'SWIPED_LEFT', velocity: event.velocity });
    },
    onSwipedRight: (event) => {
      dispatch({ type: 'SWIPED_RIGHT', velocity: event.velocity });
    },
    onSwipedUp: handleSwipedUpOrDown,
    onSwipedDown: handleSwipedUpOrDown,
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
        {props.images.map(
          (image, index) => <img key={index} className='slide' src={image} draggable='false'/>
        )}
      </div>
      <img
        src={prev}
        className='control prev'
        style={{ opacity: areControlsVisible ? '1' : '0' }}
        onClick={() => dispatch({type: 'PREV_SLIDE'})}
        alt='Previous slide'
      />
      <img
        src={next}
        className='control next'
        style={{ opacity: areControlsVisible ? '1' : '0' }}
        onClick={() => dispatch({type: 'NEXT_SLIDE'})}
        alt='Next slide'
      />
    </div>
  );
}

export default ImageSlider;
