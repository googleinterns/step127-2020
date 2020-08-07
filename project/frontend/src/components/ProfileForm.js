import './ProfileForm.css';

import React, { useContext, useState } from 'react';

import AuthContext from './Authentication.js';
import ButtonGroup from './ButtonGroup';
import FirestoreContext from '../contexts/FirestoreContext.js';
import PreferenceForm from './PreferenceForm.js';

/**
 * A form used to gather information for a user's profile page.
 */
function ProfileForm() {
  const { firestore } = useContext(FirestoreContext);
  const authContext = useContext(AuthContext);
  console.log(authContext);

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
  const cuisineOptions = ['Italian', 'Mexican'];

  const [checkedDistanceButtons, setCheckedDistanceButtons] = useState([]);
  const [checkedPriceButtons, setCheckedPriceButtons] = useState([]);
  const [checkedExperienceButtons, setCheckedExperienceButtons] = useState([]);

  // This is a filler value. I plan on moving all cuisine stuff to PreferenceForm.js
  const setCuisine = () => {};

  const sendCheckedButtons = (id, isSelected) => {
    const checkedButtons = [];
    const labels = labelsList[id];
    for (const [key, value] of Object.entries(isSelected)) {
      if (value) {
        checkedButtons.push(labels[key]);
      }
    }
    if (id === 'distance') {
      setCheckedDistanceButtons(checkedButtons);
    } else if (id === 'price') {
      setCheckedPriceButtons(checkedButtons);
    } else {
      setCheckedExperienceButtons(checkedButtons);
    }
  };

  const handleSubmit = () => {
    // going to need to get the user's thingy based on their email
    // and then from there we are going to update everything based on the updated values
    firestore.collection('users').where('email', '==', insertUserEmail).get()
      .then;
  };

  return (
    <div className='profile-form-container'>
      <h4 className='profile-form-header'>Your Profile</h4>
      <PreferenceForm
        headerLabel='Your Profile'
        rowItemLabels={itemLabels}
        locationName='Your Location'
        buttonLabel='Update Profile'
        cuisineOptions={cuisineOptions}
        setCuisine={setCuisine}>
        {/**
         * If the order of the children here is changed this will need to be
         * accounted for in the preference form (PreferenceForm.js).
         */}
        <ButtonGroup
          id='distance'
          labelList={labelsList.distance}
          sendCheckedButtons={sendCheckedButtons}
        />
        <ButtonGroup
          id='price'
          labelList={labelsList.price}
          sendCheckedButtons={sendCheckedButtons}
        />
        <ButtonGroup
          id='experience'
          labelList={labelsList.experience}
          sendCheckedButtons={sendCheckedButtons}
        />
      </PreferenceForm>
    </div>
  );
}

export default ProfileForm;
