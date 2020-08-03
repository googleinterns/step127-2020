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
    <PreferenceForm headerLabel='Your Profile'>
      {/* TODO: change so that if a location isn't inputted then we are going to need to have a fill in optiob. */}
      <FormItem imageName={Place} label='Your Location'>
        <p>Your Location</p>
      </FormItem>
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
