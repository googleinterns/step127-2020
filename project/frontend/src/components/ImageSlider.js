import './ImageSlider.css';

import React, { useState, useReducer, useRef, useLayoutEffect } from 'react';
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
 * @param {boolean=} props.collapsed An optional control over whether this slider
 *     is in a collapsed or full view (default: false).
 */
function ImageSlider(props) {
  const { images, collapsed = false } = props;

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

  const slider = useRef(null);
  const sliderMaxHeight = useRef(null);

  useLayoutEffect(() => {
    sliderMaxHeight.current = slider.current.offsetHeight;
    if (collapsed) {
      slider.current.style.height = '0px';
    } else {
      slider.current.style.height = sliderMaxHeight.current + 'px';
    }
    // We only want this effect to run once (the very first time this component
    // is laid out) so that we may capture the uncollapsed height of this slider
    // and save it to a persistent ref (sliderMaxHeight).
    // Adding `collapsed` to the dependency array below, as eslint would have us do,
    // would cause the value of `sliderMaxHeight` to be updated to 0px when the
    // slider goes from a collapsed -> uncollapsed state.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On the first render event of this component, the slider will be rendered with
  // a default full height of 200px regardless of whether `collapsed` is true or false.
  // This allows the full height to be captured in the above layoutEffect before this
  // component is painted to the screen.
  // This full height may actually be less than the explicitly set 200px because this
  // slider is a child of a flexbox parent (RestaurantCard) which may give this slider
  // a smaller height if the text content of the RestaurantCard requires more vertical
  // space (line wrapping from long name, address, website, etc.).
  // The layoutEffect also updates the slider's height according to the value of
  // `collapsed` before painting so there is no flicker even though an initially
  // collapsed slider will be first rendered at full height.
  //
  // This is all necessary to avoid hardcoding the maximum height of the slider when
  // animating between collapsed and uncollapsed states so that animation timing is
  // consistent between RestaurantCards with different content heights. The variable
  // height of this slider also allows the RestaurantCard total height to be constant
  // across all RestaurantCards regardless of line wrapping in text content.
  const sliderStyle = {
    height: !sliderMaxHeight.current
      ? '200px'
      : collapsed
      ? '0px'
      : sliderMaxHeight.current,
    transition: !sliderMaxHeight.current
      ? 'none'
      : 'height 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)',
  };

  return (
    <div
      className='slider'
      ref={slider}
      onMouseEnter={() => setAreControlsVisible(true)}
      onMouseLeave={() => setAreControlsVisible(false)}
      style={sliderStyle}>
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
