import './MatchResultsPage.css';

import React, { useState, useEffect } from 'react';

import getRecommendation from '../scripts/recommendation_script.js';
// import MapContainer from '../components/ResultsMap.js';
import Modal from '../components/Modal.js';
import RestaurantCardStack from '../components/RestaurantCardStack.js';

function MatchResultsPage(props) {
  const formState = props.location.state;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);

  useEffect(() => {
    getRecommendation(formState, (result) => {
      setRestaurants(result);
      setLoading(false);
    });
  }, [formState]);

  return [
    <div key='match-results' className='container u-full-width'>
      <div className='row'>
        <div className='one-half column u-pad32'>
          <h2
            className='your-match-header'
            style={{ opacity: currentRestaurantIndex !== 0 ? 0 : 1 }}>
            Your restaurant match is...
          </h2>
          <RestaurantCardStack
            restaurants={restaurants}
            currentCardIndex={currentRestaurantIndex}
            setCurrentCardIndex={setCurrentRestaurantIndex}
          />
        </div>
        <div className='one-half column'>
          <div style={{ width: '100%', height: '100%' }}>
            <p>MAP</p>
          </div>
        </div>
      </div>
    </div>,
    <Modal key='loading-modal' open={loading} center={true}>
      <div style={{ height: '300px', width: '300px' }}>
        <p>Hi there your results are loading...</p>
      </div>
    </Modal>,
  ];
}

export default MatchResultsPage;
