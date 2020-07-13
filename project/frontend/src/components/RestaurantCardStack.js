import './RestaurantCardStack.css';

import React, { useState } from 'react';

import RestaurantCard from './RestaurantCard.js';

/**
 * A navigable stack of restaurant cards.
 *
 * @param {!Array<Object<string, *>>} props.cards A list of restaurant objects whose
 * data will be displayed in RestaurantCard components within this stack.
 */
function RestaurantCardStack(props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const maxScaleFactor = 1.0;
  const minScaleFactor = 0.85;
  const numberOfCollapsedCards = 3;
  const uncollapsedCardHeight = 487;
  const offsetBetweenCollapsedCards = 24;
  const offsetBeforeUncollapsedCard = 152;
  const transitionString =
    'top 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97), ' +
    'opacity 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97), ' +
    'transform 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)';
  const cards = props.cards.map((card, index) => {
    if (index < currentCardIndex - 7 || index > currentCardIndex + 7) {
      return null;
    }

    const relativeIndex = index - currentCardIndex;
    const relativeIndexAbs = Math.abs(relativeIndex);
    const offset =
      relativeIndex === 0
        ? offsetBeforeUncollapsedCard
        : relativeIndex > 0
        ? offsetBeforeUncollapsedCard +
          uncollapsedCardHeight +
          Math.min(relativeIndex, numberOfCollapsedCards) *
            offsetBetweenCollapsedCards
        : Math.max(numberOfCollapsedCards + relativeIndex, 0) *
          offsetBetweenCollapsedCards;
    const top = offset + 'px';
    const opacity = relativeIndexAbs <= numberOfCollapsedCards ? 1 : 0;
    const zIndex = props.cards.length - relativeIndexAbs;
    const transform =
      'scale(' +
      Math.min(
        Math.max(1 - relativeIndexAbs / 20, minScaleFactor),
        maxScaleFactor
      ) +
      ')';
    const transition = transitionString;
    const style = {
      position: 'absolute',
      top,
      opacity,
      zIndex,
      transform,
      transition,
    };

    return (
      <RestaurantCard
        key={card.restaurant.key.id}
        style={style}
        restaurant={card.restaurant}
        details={card.details}
        collapsed={index !== currentCardIndex}
      />
    );
  });

  return (
    <div className='restaurant-card-stack'>
      <div className='restaurant-card-stack-wrapper'>{cards}</div>
      <div className='control-container'>
        <button onClick={() => setCurrentCardIndex((prev) => prev - 1)}>
          Previous
        </button>
        <button onClick={() => setCurrentCardIndex((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default RestaurantCardStack;
