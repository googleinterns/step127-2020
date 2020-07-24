import './RestaurantCardDeck.css';

import React, { useReducer } from 'react';

import RestaurantCard from './RestaurantCard.js';

/**
 * Types of deck actions.
 * @enum {number}
 */
const Action = {
  NOT_INTERESTED: -1,
  NEUTRAL: 0,
  INTERESTED: 1,
  BACK: 2,
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
  let index = previous.index;
  const history = previous.history;

  switch (action.type) {
    case Action.INTERESTED:
    case Action.NOT_INTERESTED:
    case Action.NEUTRAL:
      history[index] = action.type;
      index++;
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
 * @param {!Array<Object<string, *>>} props.cards A list of restaurant objects whose
 * data will be displayed in RestaurantCard components within this stack.
 */
function RestaurantCardDeck(props) {
  const [state, dispatch] = useReducer(reducer, {
    index: 0,
    history: new Array(props.cards.length),
  });

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
  const cards = props.cards.map((card, index) => {
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
      zIndex: props.cards.length - index,
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
      style.left = state.history[index] * 700 + 'px';
      style.transform += ' rotate(' + state.history[index] * 45 + 'deg)';
      style.opacity = state.history[index] === Action.NEUTRAL ? 0 : 1;
    }

    return (
      <RestaurantCard
        key={card.restaurant.key.id}
        style={style}
        restaurant={card.restaurant}
        details={card.details}
      />
    );
  });

  return (
    <div className='restaurant-card-deck'>
      <div className='restaurant-card-deck-wrapper'>{cards}</div>
      <div className='control-container'>
        <button onClick={() => dispatch({ type: Action.NOT_INTERESTED })}>
          Not Interested
        </button>
        <button onClick={() => dispatch({ type: Action.INTERESTED })}>
          Interested
        </button>
      </div>
      <button onClick={() => dispatch({ type: Action.NEUTRAL })}>
        Neutral
      </button>
      <button onClick={() => dispatch({ type: Action.BACK })}>Back</button>
    </div>
  );
}

export default RestaurantCardDeck;
