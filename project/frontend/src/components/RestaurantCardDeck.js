import './RestaurantCardDeck.css';

import React, { useReducer, useEffect } from 'react';

import RestaurantCard from './RestaurantCard.js';

/**
 * Types of deck actions.
 * @enum {number}
 */
const Action = {
  NOT_INTERESTED: -1,
  INTERESTED: 1,
  BACK: 0,
  RESET: 2,
};

/**
 * A reducer for the RestaurantCardDeck component. Updates RestaurantCardDeck
 * state based on the previous state and a specified action.
 *
 * @param {!Object<string, *>} previous The previous state.
 * @param {!Action} action An action type that may determine how the
 *     state is updated.
 */
function reducer(previous, action) {
  let { index, history } = previous;

  switch (action.type) {
    case Action.RESET:
      index = 0;
      history = new Array(action.newLength);
      break;
    case Action.INTERESTED:
    case Action.NOT_INTERESTED:
      history[index] = action.type;
      if (index < history.length - 1) {
        index++;
      }
      break;
    case Action.BACK:
    default:
      if (index > 0) index--;
  }

  return { index, history };
}

/**
 * A navigable deck of restaurant cards.
 *
 * @param {!Array<Object<string, *>>} props.restaurants A list of restaurant objects
 *     whose data will be displayed in RestaurantCard components within this stack.
 * @param {function(id: string, action: number): undefined} props.onSwipe A callback
 *     executed on a user swipe. Called with the restaurant place id and action type.
 */
function RestaurantCardDeck(props) {
  const { restaurants, onSwipe } = props;

  const [state, dispatch] = useReducer(reducer, {
    index: 0,
    history: new Array(restaurants.length),
  });

  useEffect(() => {
    dispatch({ type: Action.RESET, newLength: restaurants.length });
  }, [restaurants.length]);

  const maxScaleFactor = 1.0;
  const minScaleFactor = 0.9;
  const numberOfRenderedCards = 7;
  const numberOfVisibleCards = 3;
  const offsetPxBetweenCards = 24;
  const transitionString =
    'top 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97), ' +
    'left 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97), ' +
    'transform 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97), ' +
    'opacity 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)';
  const cards = restaurants.map((restaurant, index) => {
    if (
      index < state.index - numberOfRenderedCards ||
      index > state.index + numberOfRenderedCards
    ) {
      return null;
    }

    const relativeIndex = index - state.index;
    const style = {
      position: 'absolute',
      top:
        Math.min(relativeIndex, numberOfVisibleCards - 1) *
          offsetPxBetweenCards +
        'px',
      left: '0px',
      opacity: relativeIndex < numberOfVisibleCards ? 1 : 0,
      zIndex: restaurants.length - index,
      transform:
        'scale(' +
        Math.min(
          Math.max(1 - relativeIndex / 20, minScaleFactor),
          maxScaleFactor
        ) +
        ') rotate(0deg)',
      transition: transitionString,
    };

    if (relativeIndex < 0) {
      style.top = '-100px';
      style.left = state.history[index] * 750 + 'px';
      style.transform += ' rotate(' + state.history[index] * 45 + 'deg)';
    }

    return (
      <RestaurantCard
        key={restaurant.key.id}
        style={style}
        restaurant={restaurant}
      />
    );
  });

  const onClick = (index, action) => {
    if (onSwipe) onSwipe(restaurants[index].key.id, action);
    dispatch({ type: action });
  };

  return (
    <div className='restaurant-card-deck'>
      <div className='restaurant-card-deck-wrapper'>{cards}</div>
      <div className='control-container'>
        <button onClick={() => onClick(state.index, Action.NOT_INTERESTED)}>
          Not Interested
        </button>
        <button onClick={() => onClick(state.index, Action.INTERESTED)}>
          Interested
        </button>
      </div>
      <button onClick={() => dispatch({ type: Action.BACK })}>Back</button>
    </div>
  );
}

export default RestaurantCardDeck;
