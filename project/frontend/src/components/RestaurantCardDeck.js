import './RestaurantCardDeck.css';

import React from 'react';

import RestaurantCard from './RestaurantCard.js';

function RestaurantCardDeck(props) {
  const cards = props.cards;

  return (
    <div className='restaurant-card-deck'>
      {cards.map((card, index) => (
        <RestaurantCard
          key={card.restaurant.key.id}
          restaurant={card.restaurant}
          details={card.details}
        />
      ))}
    </div>
  );
}

export default RestaurantCardDeck;
