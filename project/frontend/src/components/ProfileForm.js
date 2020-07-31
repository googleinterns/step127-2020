import './ProfileForm.css';

import React, { useState } from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import { useHistory } from 'react-router-dom';

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
    <div className='profile-form-container'>
      <form className='profile-form'>
        <h4 className='profile-header'>Your profile.</h4>
        <div className='profile-form-row'>
          <img src={Place} alt='' />
          <label>Your Location</label>
          {/* TODO: change so that if a location isn't inputted then we are going to need to have a fill in optiob. */}
          <p>Your location</p>
        </div>
        <div className='profile-form-row'>
          <img src={Cuisine} alt='' />
          <label htmlFor='cuisine'>Preferred Cuisines</label>
          <CuisineAutocomplete
            cuisineOptions={cuisineOptions}
            setCuisine={setCuisine}
          />
        </div>
        <div className='profile-form-row'>
          <img src={Distance} alt='' />
          <label htmlFor='distance'>Ideal Distance</label>
          <div className='btn-group'>
            <button className='distance-button'>1 mile</button>
            <button className='distance-button'>5 miles</button>
            <button className='distance-button'>10 miles</button>
            <button className='distance-button'>25 miles</button>
          </div>
        </div>
        <div className='profile-form-row'>
          <img src={Price} alt='' />
          <label htmlFor='price'>Price Level</label>
          <div class='btn-group'>
            {/* im considering making this its own component with a for-loop that adds however many buttons are necessary. */}
            <button>$</button>
            <button>$$</button>
            <button>$$$</button>
            <button>$$$$</button>
          </div>
        </div>
        <div className='profile-form-submit-container'>
          <button type='submit'>Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
