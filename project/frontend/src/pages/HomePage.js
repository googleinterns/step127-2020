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
            All you have to do is fill out the form and tell us what kind of restaurant you are looking for-- 
            the rest is on us. We'll use your preferences to find the restaurants that we think would be perfect for you!
            Along with considering your preferences, we'll also take a look at the ratings of each restaurant, so we can
            reccommend a great restaurant that fits your desires.
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
            Swipe right on the restaurants you love, and left on the ones you're not so interested in.
            Join a group with your friends, and start swiping! As you are all swiping, you can see a leaderboard
            in real time showing the popularity of the restaurants among your group.
          </p>
        </div>
        <div
          className='example'
          style={{ transform: 'translateX(-48px)' }}></div>
      </div>
      <div className='row-flex feedback u-pad48'>
        <h4>Have any feedback?</h4>
        <button>Let us know</button>
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
