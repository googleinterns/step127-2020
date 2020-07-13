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

// TODO: Scale RestaurantCard dimensions based on screen size.
/**
 * The default width of a slide.
 *
 * @type {number}
 */
const width = 344;

// TODO: Move reducer to its own file.
/**
 * A reducer for the ImageSlider component. Updates ImageSlider state
 * based on the previous state and a specified action.
 *
 * @param {!Object<string, *>} previous The previous state.
 * @param {!Action} action An action type that may determine how the
 *     state is updated.
 */
function reducer(previous, action) {
  let { left, lastLeft, slide, slideCount, shifting } = previous;

  switch (action.type) {
    case Action.SWIPING:
      const minLeft = (slideCount - 1) * -width;
      const maxLeft = 0.0;
      left = Math.min(Math.max(lastLeft + action.deltaX, minLeft), maxLeft);
      shifting = false;

      // Update the current slide if user slides
      // passed multiple slides in one motion.
      const dir = action.deltaX > 0 ? 'right' : 'left';
      if (dir === 'left') {
        if (left <= (slide + 1) * -width) {
          slide++;
        } else if (left > slide * -width) {
          slide--;
        }
      } else {
        if (left >= (slide - 1) * -width) {
          slide--;
        } else if (left < slide * -width) {
          slide++;
        }
      }
      break;
    case Action.SWIPED_LEFT:
      // Spring slider back to current slide or to next
      // slide depending on how far the user slid.
      if (slide < slideCount - 1) {
        if (Math.abs(left) % width > width / 2 || action.velocity >= 0.5) {
          slide++;
        }
      }
      break;
    case Action.SWIPED_RIGHT:
      // Spring slider back to current slide or to previous
      // slide depending on how far the user slid.
      if (slide > 0) {
        if (
          width - (Math.abs(left) % width) > width / 2 ||
          action.velocity >= 0.5
        ) {
          slide--;
        }
      }
      break;
    case Action.PREV_SLIDE:
      if (slide > 0) slide--;
      break;
    case Action.NEXT_SLIDE:
      if (slide < slideCount - 1) slide++;
      break;
    default:
      throw new Error();
  }

  if (action.type !== Action.SWIPING) {
    left = slide * -width;
    lastLeft = left;
    shifting = true;
  }

  return { left, lastLeft, slide, slideCount, shifting };
}

/**
 * An image slider component for use within the RestaurantCard component.
 * Provides an image view that may be dragged (with touch or mouse) to
 * reveal more images.
 *
 * @param {!Array<string>} props.images An array of image URLs pointing to the
 *     images that should be displayed in this slider.
 */
function ImageSlider(props) {
  const images = props.images;

  const [areControlsVisible, setAreControlsVisible] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    left: 0,
    lastLeft: 0,
    slide: 0,
    slideCount: images.length,
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
        {images.map((image, index) => (
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
