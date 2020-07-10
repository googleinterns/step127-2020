import React, { useState, useEffect } from 'react';

import getRecommendation from '../scripts/recommendation_script.js';

async function fetchDetails(placeIds) {
  const responses = await Promise.all(placeIds.map(
    (placeId) => 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
      placeId +
      '&key=' +
      process.env.REACT_APP_GOOGLE_API_KEY
  ));

  const data = await Promise.all(responses.map((response) => response.json()));
  console.log(data);
  return data;
}

function MatchResultsPage(props) {
  // const { data } = this.props.location;
  console.log(props.location.state);

  const [restaurants, setRestaurants] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendation(props.location.state, (result) => {
      setRestaurants(result);
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  } else {
    return <p>Loaded!</p>;
  }
}

export default MatchResultsPage;
