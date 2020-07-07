import './ImageSlider.css';

import React, { useState, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';

import Next from '../assets/next.svg';
import Prev from '../assets/prev.svg';

/**
 * Types of swipe actions.
 * @enum {number}
 */
const Action = {
  SWIPING: 0,
  SWIPED_LEFT: 1,
  SWIPED_RIGHT: 2,
  PREV_SLIDE: 3,
  NEXT_SLIDE: 4,
};

/**
 * The default width of a slide.
 *
 * @type {number}
 */
const width = 344;

/**
 * A reducer for the ImageSlider component. Updates ImageSlider state
 * based on the previous state and a specified action.
 *
 */
function reducer(state, action) {
  switch (action.type) {
    case Action.SWIPING: {
      let newLeft = state.lastLeft + action.deltaX;
      const minLeft = (state.slideCount - 1) * -width;
      const maxLeft = 0.0;
      newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

      // Update the current slide if user slides
      // passed multiple slides in one motion.
      let newSlide = state.slide;
      const dir = action.deltaX > 0 ? 'right' : 'left';
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
    case Action.SWIPED_LEFT: {
      let newSlide = state.slide;

      // Spring slider back to current slide or to next
      // slide depending on how far the user slid.
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
    case Action.SWIPED_RIGHT: {
      let newSlide = state.slide;

      // Spring slider back to current slide or to previous
      // slide depending on how far the user slid.
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
    case Action.PREV_SLIDE: {
      const newSlide = state.slide > 0 ? state.slide - 1 : state.slide;
      const newLeft = newSlide * -width;
      return {
        left: newLeft,
        lastLeft: newLeft,
        slide: newSlide,
        slideCount: state.slideCount,
        shifting: true,
      };
    }
    case Action.NEXT_SLIDE: {
      const newSlide =
        state.slide < state.slideCount - 1 ? state.slide + 1 : state.slide;
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
      dispatch({ type: Action.SWIPED_LEFT, velocity: 0 });
    } else {
      dispatch({ type: Action.SWIPED_RIGHT, velocity: 0 });
    }
  };

  const handlers = useSwipeable({
    onSwiping: (event) => {
      dispatch({ type: Action.SWIPING, deltaX: -event.deltaX });
    },
    onSwipedLeft: (event) => {
      dispatch({ type: Action.SWIPED_LEFT, velocity: event.velocity });
    },
    onSwipedRight: (event) => {
      dispatch({ type: Action.SWIPED_RIGHT, velocity: event.velocity });
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
        {props.images.map((image, index) => (
          <img
            key={index}
            className='slide'
            src={image}
            draggable='false'
            alt='Restaurant photographs'
          />
        ))}
      </div>
      <img
        src={Prev}
        className='control prev'
        style={{ opacity: areControlsVisible ? '1' : '0' }}
        onClick={() => dispatch({ type: Action.PREV_SLIDE })}
        alt='Previous slide'
      />
      <img
        src={Next}
        className='control next'
        style={{ opacity: areControlsVisible ? '1' : '0' }}
        onClick={() => dispatch({ type: Action.NEXT_SLIDE })}
        alt='Next slide'
      />
    </div>
  );
}

export default ImageSlider;
