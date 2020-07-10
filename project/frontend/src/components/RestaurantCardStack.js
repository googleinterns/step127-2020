import './RestaurantCardStack.css';

import React, { useState, useLayoutEffect, useRef, useReducer } from 'react';

import RestaurantCard from './RestaurantCard.js';

function RestaurantCardStack(props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const stackWrapper = useRef(null);
  const cardHeight = useRef(0);
  const cardRefs = useRef(new Array(props.cards.length));

  useLayoutEffect(() => {
    console.log('using layout effect');
    cardHeight.current = cardRefs.current[0].offsetHeight;
    stackWrapper.current.style.height = cardHeight.current + 192 + 'px';
    stackWrapper.current.style.width =
      cardRefs.current[currentCardIndex].offsetWidth + 'px';

    for (let i = currentCardIndex + 1; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i];
      if (card) {
        card.style.top =
          +card.style.top.slice(0, -2) + cardHeight.current + 'px';
      }
    }
  }, []);

  const cards = props.cards.map((card, index) => {
    // Render only the 15 cards around the current card index.
    if (index < currentCardIndex - 7 || index > currentCardIndex + 7) {
      return null;
    }

    const relativeIndex = index - currentCardIndex;

    const style = {
      position: 'absolute',
      top:
        relativeIndex < 5
          ? cardHeight.current + relativeIndex * 24 + 'px'
          : cardHeight.current + 72 + 'px',
      left: '0px',
      opacity: relativeIndex < 4 ? 1 : 0,
      zIndex: props.cards.length - index,
      transform: `scale(${Math.min(1 - relativeIndex / 20, 1.0)}) rotate(0deg)`,
      transition:
        cardHeight.current === 0.0
          ? ''
          : 'all 0.75s cubic-bezier(0.35, 0.91, 0.33, 0.97)',
    };

    if (relativeIndex === 0) {
      style.top = '0px';
    } else if (relativeIndex < 0) {
      style.top = '-100px';
      style.left = '-700px';
      style.transform += ' rotate(-45deg)';
    }

    const collapsed = index <= currentCardIndex ? false : true;

    return (
      <RestaurantCard
        parentRef={(el) => (cardRefs.current[index] = el)}
        key={card.restaurant.key.id}
        style={style}
        restaurant={card.restaurant}
        details={card.details}
        collapsed={collapsed}
      />
    );
  });

  return (
    <div className='restaurant-card-stack'>
      <div ref={stackWrapper} className='restaurant-card-stack-wrapper'>
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

export default RestaurantCardStack;
