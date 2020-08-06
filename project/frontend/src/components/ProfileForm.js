import React from 'react';
import './ProfileForm.css';

import ButtonGroup from './ButtonGroup.js';
import PreferenceForm from './PreferenceForm.js';

/**
 * A form used to gather the restaurant preferences of a user for the 'Find My Match'
 * service.
 *
 * @param {!Object<string, number>} currLocation The current latitude and longitude
 *     coordinates of the user.
 * @param {string} locationName The formatted address of the current user.
 */
function ProfileForm(props) {
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
      <PreferenceForm
        headerLabel='Your Profile'
        rowItemLabels={itemLabels}
        locationName='Your Location'
        buttonLabel='Update Profile'
        cuisineOptions={cuisineOptions}
        setCuisine={setCuisine}>
        <ButtonGroup
          labelList={['1 mile', '5 miles', '10 miles', '25 miles']}
        />
        <ButtonGroup labelList={['$', '$$', '$$$', '$$$$']} />
        <ButtonGroup labelList={['Takeout', 'Delivery', 'Dine-In']} />
      </PreferenceForm>
    </div>
  );
}

export default ProfileForm;
