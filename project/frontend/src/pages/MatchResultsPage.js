import React, { useState, useEffect } from 'react';

import getRecommendation from '../scripts/recommendation_script.js';
import MapContainer from '../components/ResultsMap.js';
import Modal from '../components/Modal.js';
import RestaurantCardStack from '../components/RestaurantCardStack.js';

async function fetchDetails(restaurants) {
  const batchSize = 5;
  for (let i = 0; i < restaurants.length; i += batchSize) {
    const placeIds = restaurants.slice(i, i + batchSize).map((el) => el.restaurant.place_id);
    const responses = await Promise.all(
      placeIds.map(
        (placeId) =>
          'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
          placeId +
          '&key=' +
          process.env.REACT_APP_GOOGLE_API_KEY
      )
    );

    const data = await Promise.all(responses.map((response) => response.json()));
    console.log(data);
  }
}

function MatchResultsPage(props) {
  const formState = props.location.state;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendation(formState, (result) => {
      const restaurants = result.map((res) => ({restaurant: res, details: null}));
      setRestaurants(restaurants);
      fetchDetails(restaurants);
    });
  }, []);

  return [
    <div key='match-results' className='container'>
      <div className='row'>
        <div className='one-half column'>
          <RestaurantCardStack cards={restaurants} />
        </div>
        <div className='one-half column'>
          <MapContainer />
        </div>
      </div>
    </div>,
    <Modal key='loading-modal' open={loading} center={true}>
      <div style={{height: '300px', width: '300px'}}>
        <p>Hi there your results are loading...</p>
      </div>
    </Modal>
  ];
}

export default MatchResultsPage;
