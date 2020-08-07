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
  // going to need to do some sort of null checking here to make sure that
  // things don't break!
  const user = authContext.currentUser.get;
  const userId = user.getId();

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

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [location, setLocation] = useState('');
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

  const handleSubmit = (event) => {
    // update the database based on the users' inputted values
    // sooo we need to pass the cuisine and location into here (with a call back function)
    // and then we call it here
    event.preventDefault();
    firestore.collection('users').doc(userId).update({
      location: '',
      cuisines: cuisineOptions,
      distance: checkedDistanceButtons,
      price: checkedPriceButtons,
      experience: checkedExperienceButtons,
    });
  };

  return (
    <div className='profile-form-container'>
      <h4 className='profile-form-header'>Your Profile</h4>
      <PreferenceForm
        headerLabel='Your Profile'
        rowItemLabels={itemLabels}
        locationName='Your Location'
        buttonLabel='Update Profile'
        handleSubmit={handleSubmit}
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
