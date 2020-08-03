import './ProfileForm.css';

import React, { useState } from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import ButtonGroup from './ButtonGroup.js';
import PreferenceForm from './PreferenceForm.js';
import FormItem from './FormItem.js';

import Place from '../assets/place.svg';
import Cuisine from '../assets/cuisine.svg';
import Distance from '../assets/distance.svg';
import Experience from '../assets/food_service.svg';
import Price from '../assets/dollar.svg';

/**
 * A form used to gather the restaurant preferences of a user for the 'Find My Match'
 * service.
 *
 * @param {!Object<string, number>} currLocation The current latitude and longitude
 *     coordinates of the user.
 * @param {string} locationName The formatted address of the current user.
 */
function ProfileForm(props) {
  const cuisineOptions = ['Italian', 'Mexican', 'Indian'];
  const [cuisine, setCuisine] = useState([]);

  return (
    // <div className='profile-form-container'>
    //   <form className='profile-form'>
    //     <h4 className='profile-header'>Your profile.</h4>
    <PreferenceForm headerLabel='Your Profile'>
      <div className='profile-form-row'>
        <img src={Place} alt='' />
        <label>Your Location</label>
        {/* TODO: change so that if a location isn't inputted then we are going to need to have a fill in optiob. */}
        <p>Your location</p>
      </div>
      <FormItem imageName={Cuisine} label='PreferredCuisine'>
        <CuisineAutocomplete
          cuisineOptions={cuisineOptions}
          setCuisine={setCuisine}
        />
      </FormItem>
      <FormItem imageName={Distance} label='Ideal Distance'>
        <ButtonGroup
          labelList={['1 mile', '5 miles', '10 miles', '25 miles']}
        />
      </FormItem>
      <FormItem imageName={Price} label='Price Level'>
        <ButtonGroup labelList={['$', '$$', '$$$', '$$$$']} />
      </FormItem>
      <FormItem imageName={Experience} label='Dining Experience'>
        <ButtonGroup labelList={['Takeout', 'Delivery', 'Dine-In']} />
      </FormItem>
    </PreferenceForm>
  );
}

export default ProfileForm;
