import getRecommendation from '../scripts/recommendation_script.js';
import MapContainer from '../components/ResultsMap.js';
import Modal from '../components/Modal.js';
import React, { useState, useEffect } from 'react';

function MatchResultsPage(props) {
  // Form state is in `props.location.state`.
  // this is going to have the users location here
  // send current location in the map container and initialize that in here
  // copy over the current restaurant index state
  const formState = props.location.state;
  console.log('yada yada');
  console.log(formState);
  const userLocation = formState.currLocation;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendation(formState, (result) => {
      setRestaurants(result);
      setLoading(false);
      console.log('ha');
      console.log(result);
    });
  }, [formState]);
  console.log('boom');
  console.log(restaurants);

  // make a conditional so that map container is made only when

  return [
    <Modal key='loading-modal' open={loading} center={true}>
      <div style={{ height: '300px', width: '300px' }}>
        <p>Hi there your results are loading...</p>
      </div>
    </Modal>,
    <MapContainer restaurants={restaurants} userLocation={userLocation} />,
  ];
}

export default MatchResultsPage;
