import './MatchResultsPage.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import getRecommendation from '../scripts/recommendation_script.js';
import Loading from '../components/Loading.js';
import MapContainer from '../components/MapContainer.js';
import Modal from '../components/Modal.js';
import RestaurantCardStack from '../components/RestaurantCardStack.js';

function MatchResultsPage(props) {
  const formState = props.location.state;
  const userLocation = formState.currLocation;

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getRecommendation(formState, (result, err) => {
      if (err) {
        setErrorMessage(err.message);
      } else {
        setRestaurants(result);
      }
      setLoading(false);
    });
  }, [formState]);

  const cardStack = !errorMessage ? (
    <RestaurantCardStack
      restaurants={restaurants}
      currentCardIndex={currentRestaurantIndex}
      setCurrentCardIndex={setCurrentRestaurantIndex}
    />
  ) : null;

  const map = !errorMessage ? (
    <MapContainer
      restaurants={restaurants}
      userLocation={userLocation}
      currentCardIndex={currentRestaurantIndex}
      setCurrentCardIndex={setCurrentRestaurantIndex}
    />
  ) : null;

  return [
    <div key='match-results' className='container u-full-width'>
      <div className='row u-flex'>
        <div className='one-half column u-pad32'>
          <h2
            className='your-match-header'
            style={{
              opacity: errorMessage || currentRestaurantIndex !== 0 ? 0 : 1,
            }}>
            Your restaurant match is...
          </h2>
          {cardStack}
        </div>
        {map}
      </div>
    </div>,
    <Modal key='loading-modal' open={loading} center={true}>
      <div className='your-match-loading-modal'>
        <h4>Putting the 1s and 0s to work to find your best match.</h4>
        <div>
          <Loading />
        </div>
      </div>
    </Modal>,
    <Modal key='error-modal' open={Boolean(errorMessage)} center={true}>
      <div style={{ height: '300px', width: '300px' }}>
        <h5>{errorMessage}</h5>
        <Link to={{ pathname: '/', state: formState }}>
          Return to Home Page
        </Link>
      </div>
    </Modal>,
  ];
}

export default MatchResultsPage;
