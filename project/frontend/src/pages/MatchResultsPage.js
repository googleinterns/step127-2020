import React from 'react';

import getRecommendation from '../scripts/recommendation_script.js';

/*
getRecommendation(this.state, function (response) {
  propHistory.push({
    pathname: '/match-results',
    data: response,
  });
});
*/

function MatchResultsPage(props) {
  // const { data } = this.props.location;
  console.log(props.location.state);
  
  return (
    // `resultsList` is the sorted list of restaurants.
    // Each restaurant is an object with fields: hash, key, value
    // `key` has data about the restaurant (name, location, etc.).
    // `value` is the percent match for that restaurant.
    <p>Results go here</p>
  );
}

export default MatchResultsPage;
