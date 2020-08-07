import React from 'react';
import FlipMove from 'react-flip-move';
import RestaurantRankingView from '../components/RestaurantRankingView.js';

function SwipeMatchLeaderboard(props) {
  const { restaurants } = props;

  return (
    <FlipMove
      easing='cubic-bezier(0.35, 0.91, 0.33, 0.97)'
      staggerDurationBy={15}
      staggerDelayBy={20}>
      {[...restaurants]
        .sort((r1, r2) => r2.fractionLiked - r1.fractionLiked)
        .map((restaurant, index) => {
          const maxVisibleRankings = 5;
          if (index >= maxVisibleRankings) return null;
          return (
            <RestaurantRankingView
              key={restaurant.key.id}
              restaurant={restaurant}
            />
          );
        })}
    </FlipMove>
  );
}

export default SwipeMatchLeaderboard;
