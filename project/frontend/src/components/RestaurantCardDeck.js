import './RestaurantCardDeck.css';

import React, { useState, useLayoutEffect, useRef } from 'react';

import RestaurantCard from './RestaurantCard.js';

function RestaurantCardDeck(props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const deckWrapper = useRef(null);
  const renderedCard = useRef(null);

  useLayoutEffect(() => {
    deckWrapper.current.style.height =
      renderedCard.current.offsetHeight + 64 + 'px';
    deckWrapper.current.style.width = renderedCard.current.offsetWidth + 'px';
  }, []);

  const cards = props.cards.map((card, index) => {
    // Render only the 15 cards around the current card index.
    if (index < currentCardIndex - 7 || index > currentCardIndex + 7) {
      return null;
    }

    const relativeIndex = index - currentCardIndex;

    const style = {
      position: 'absolute',
      top: relativeIndex < 4 ? relativeIndex * 24 + 'px' : '72px',
      left: '0px',
      opacity: relativeIndex < 3 ? 1 : 0,
      zIndex: props.cards.length - index,
      transform: `scale(${Math.min(1 - relativeIndex / 20, 1.0)}) rotate(0deg)`,
      transition: 'all 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)',
    };

    if (relativeIndex < 0) {
      style.top = '-100px';
      style.left = '-700px';
      style.transform += ' rotate(-45deg)';
    }

    return (
      <RestaurantCard
        parentRef={renderedCard}
        key={card.restaurant.key.id}
        style={style}
        restaurant={card.restaurant}
        details={card.details}
      />
    );
  });

  return (
    <div className='restaurant-card-deck'>
      <div ref={deckWrapper} className='restaurant-card-deck-wrapper'>
        {cards}
      </div>
      <div>
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

export default RestaurantCardDeck;
