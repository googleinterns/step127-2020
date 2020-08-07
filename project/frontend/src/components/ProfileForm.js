import React from 'react';
import './ProfileForm.css';

import PreferenceForm from './PreferenceForm.js';
import ButtonGroup from './ButtonGroup';

/**
 * A form used to gather information for a user's profile page.
 */
function ProfileForm() {
  const itemLabels = {
    cuisine: 'Preferred Cuisine',
    location: 'Your Location',
    distance: 'Preferred Distance',
    price: 'Price Level',
    experience: 'Dining Experience',
  };
  const cuisineOptions = ['Italian', 'Mexican'];
  // This is a filler value. I plan on moving all cuisine stuff to PreferenceForm.js
  const setCuisine = () => {};
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
          labelList={['1 mile', '5 miles', '10 miles', '25 miles']}
        />
        <ButtonGroup id='price' labelList={['$', '$$', '$$$', '$$$$']} />
        <ButtonGroup
          id='experience'
          labelList={['Takeout', 'Delivery', 'Dine-In']}
        />
      </PreferenceForm>
    </div>
  );
}

export default ProfileForm;
