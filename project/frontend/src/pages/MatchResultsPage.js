import React from 'react';

import getRecommendation from '../scripts/recommendation_script.js';

function MatchResultsPage(props) {
  console.log(props.location.state);
  
  return (
    <p>Results page content goes here.</p>
  );
}

export default MatchResultsPage;
