import './HomePage.css';

import React, { useState } from 'react';

import LocationFinder from '../components/LocationFinder';
import Modal from '../components/Modal.js';
import UserPreferenceForm from '../components/UserPreferenceForm.js';
import SwipeMatchForm from '../components/SwipeMatchForm.js';

function HomePage(props) {
  const retrievedLocation = props.location.state
    ? props.location.state.currLocation
    : {};
  const retrievedLocationName = props.location.state
    ? props.location.state.locationName
    : '';
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);
  const [isSwipeMatchFormOpen, setIsSwipeMatchFormOpen] = useState(false);
  const [currLocation, setCurrLocation] = useState(retrievedLocation);
  const [locationName, setLocationName] = useState(retrievedLocationName);

  const togglePreferenceForm = () => {
    setIsPreferenceFormOpen((prev) => !prev);
  };

  const toggleSwipeMatchForm = () => {
    setIsSwipeMatchFormOpen((prev) => !prev);
  };

  const handleLocationData = (locationData) => {
    setCurrLocation(locationData.currLocation);
    setLocationName(locationData.locationName);
  };

  const buttonStyle = locationName
    ? { opacity: 1, transform: 'translateY(0px)' }
    : { opacity: 0, transform: 'translateY(-24px)' };

  return [
    <div key='home-page' className='container u-full-width'>
      <div className='row'>
        <div id='welcome' className='column'>
          <h1 className='logo'>MAKMatch</h1>
          <h4>Discover your restaurant match.</h4>
          <LocationFinder
            locationName={locationName}
            sendData={handleLocationData}
          />
          <div>
            <button
              className='welcome-button'
              disabled={!locationName}
              onClick={togglePreferenceForm}
              style={buttonStyle}>
              Find My Match
            </button>
            <button
              className='welcome-button'
              disabled={!locationName}
              onClick={toggleSwipeMatchForm}
              style={buttonStyle}>
              Swipe Match
            </button>
          </div>
        </div>
      </div>
      <div className='row match u-pad32'>
        <h4 className='title'>What we do</h4>
        <h5 className='subtitle'>Welcome</h5>
      </div>
      <div className='row-flex match u-pad64 u-pad-no-top'>
        <div
          className='example'
          style={{ transform: 'translateX(48px)' }}></div>
        <div className='seven columns description match u-pad56'>
          <h4>Let us find your best restaurant match.</h4>
          <p>
            You tell us what you're in the mood for and the rest is on is.
            We use your preferences to find the restaurants that we think are your
            perfect fit! Along with considering your preferences, we take a
            look at ratings, distance, and more, so we can be sure that you're
            getting the highest quality reccommendations that fit what you're
            looking for. Get started by providing your location above!
          </p>
        </div>
      </div>
      <div className='row swipe u-pad32'>
        <h4 className='title'>Swipe Match</h4>
        <h5 className='subtitle'>Idk yet</h5>
      </div>
      <div className='row-flex swipe u-pad64 u-pad-no-top'>
        <div className='seven columns description swipe u-pad56'>
          <h4>
            Find the restaurant all your friends or family agree on with Swipe
            Match.
          </h4>
          <p>
            Swipe right on the restaurants you love, and left on the ones you're
            not so interested in. Join a group with your friends, and start
            swiping! As you swipe, a real-time leaderboard shows the top picks
            among your group. Get started by providing your location above!
          </p>
        </div>
        <div
          className='example'
          style={{ transform: 'translateX(-48px)' }}></div>
      </div>
    </div>,
    <Modal
      key='preference-form'
      open={isPreferenceFormOpen}
      onDismiss={togglePreferenceForm}
      centerHorizontal={true}
      top='64px'
      bottom='64px'
      style={{ paddingBottom: '0px' }}>
      <UserPreferenceForm
        currLocation={currLocation}
        locationName={locationName}
      />
    </Modal>,
    <Modal
      key='swipe-match-form'
      open={isSwipeMatchFormOpen}
      onDismiss={toggleSwipeMatchForm}
      centerHorizontal={true}
      top='64px'
      bottom='64px'>
      <SwipeMatchForm currLocation={currLocation} locationName={locationName} />
    </Modal>,
  ];
}

export default HomePage;
