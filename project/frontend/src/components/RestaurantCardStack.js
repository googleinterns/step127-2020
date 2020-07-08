import './RestaurantCardStack.css';

import React from 'react';

function RestaurantCardStack(props) {
  const cards = props.children;

  return (
    <div className='restaurant-card-stack'>
      {cards}
    </div>
  );
}

export default RestaurantCardStack;
