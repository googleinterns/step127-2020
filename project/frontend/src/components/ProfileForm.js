import './ProfileForm.css';

import React, { useContext, useState } from 'react';

import { AuthContext } from '../components/Authentication.js';
import ButtonGroup from './ButtonGroup';
import FirestoreContext from '../contexts/FirestoreContext.js';
import PreferenceForm from './PreferenceForm.js';

/**
 * A form used to gather information for a user's profile page.
 */
function ProfileForm() {
  const { firestore } = useContext(FirestoreContext);
  const authContext = useContext(AuthContext);
  let user = authContext.currentUser.get;

  const itemLabels = {
    cuisine: 'Preferred Cuisine',
    location: 'Your Location',
    distance: 'Preferred Distance',
    price: 'Price Level',
    experience: 'Dining Experience',
  };
  const labelsList = {
    distance: ['1 mile', '5 miles', '10 miles', '25 miles'],
    price: ['$', '$$', '$$$', '$$$$'],
    experience: ['Takeout', 'Delivery', 'Dine-In'],
  };
  const cuisineOptions = [''];

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [clickedDistanceButtons, setClickedDistanceButtons] = useState([]);
  const [clickedPriceButtons, setClickedPriceButtons] = useState([]);
  const [clickedExperienceButtons, setClickedExperienceButtons] = useState([]);

  /**
   * A callback function that is going to be used to get the updated
   * map of clicked buttons from the <ButtonGroup> component's on click function.
   *
   * The clicked button state will get updated for the corresponding id.
   */
  const clickedButtonsCallback = (id, clickedButtonsMap) => {
    const clickedButtons = [];
    const labels = labelsList[id];
    for (const [buttonNumber, isClicked] of Object.entries(clickedButtonsMap)) {
      if (isClicked) {
        clickedButtons.push(labels[buttonNumber]);
      }
    }
    if (id === 'distance') {
      setClickedDistanceButtons(clickedButtons);
    } else if (id === 'price') {
      setClickedPriceButtons(clickedButtons);
    } else {
      setClickedExperienceButtons(clickedButtons);
    }
  };

  /**
   * Updates the database if the user has changed any of their previous preferences.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!(user && user.isSignedIn())) {
      return;
    }
    const userId = user.getId();
    firestore.collection('users').doc(userId).update({
      cuisines: selectedCuisines,
      distance: clickedDistanceButtons,
      price: clickedPriceButtons,
      experience: clickedExperienceButtons,
    });
  };

  return (
    <div className='profile-form-container'>
      <h4 className='profile-form-header'>Your Profile</h4>
      <PreferenceForm
        headerLabel='Your Profile'
        rowItemLabels={itemLabels}
        buttonLabel='Update Profile'
        handleSubmit={handleSubmit}
        cuisineOptions={cuisineOptions}
        setCuisine={setSelectedCuisines}>
        {/**
         * If the order of the children here is changed this will need to be
         * accounted for in the preference form (PreferenceForm.js).
         */}
        <ButtonGroup
          id='distance'
          labelList={labelsList.distance}
          sendClickedButtons={clickedButtonsCallback}
        />
        <ButtonGroup
          id='price'
          labelList={labelsList.price}
          sendClickedButtons={clickedButtonsCallback}
        />
        <ButtonGroup
          id='experience'
          labelList={labelsList.experience}
          sendClickedButtons={clickedButtonsCallback}
        />
      </PreferenceForm>
    </div>
  );
}

export default ProfileForm;
