import './ProfileForm.css';

import React, { useState, useEffect, useContext } from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import { Slider } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './Authentication.js';

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
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [cuisineOptions, setCuisineOptions] = useState([
    'Italian',
    'Mexican',
    'Indian',
  ]);
  const [cuisine, setCuisine] = useState([]);
  const [radius, setRadius] = useState('');
  const [radiusWeight, setRadiusWeight] = useState(3);
  const [diningExp, setDiningExp] = useState('');
  const [diningExpWeight, setDiningExpWeight] = useState(3);
  const [priceLevel, setPriceLevel] = useState('');
  const [priceLevelWeight, setPriceLevelWeight] = useState(3);
  const [open, setOpen] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/match-results',
      state: {
        cuisine,
        radius: { pref: radius, weight: radiusWeight },
        diningExp: { pref: diningExp, weight: diningExpWeight },
        priceLevel: { pref: priceLevel, weight: priceLevelWeight },
        open,
        cuisineOptions,
      },
    });
  };

  const getSelect = (name, value, setValue, options) => {
    const onChange = (event) => {
      const value = event.target.value;
      setValue(event.target.name === 'diningExp' ? value : parseInt(value));
    };

    return (
      <select name={name} className='pref' value={value} onChange={onChange}>
        <option label='Select...' key='default' value={''} />
        {Object.entries(options).map(([label, value]) => (
          <option label={label} key={label} value={value} />
        ))}
      </select>
    );
  };

  const distancesInMiles = {
    '1 mile': 1,
    '5 miles': 5,
    '10 miles': 10,
    '25 miles': 25,
  };

  const diningExperiences = {
    Takeout: 'meal_takeaway',
    Delivery: 'meal_delivery',
    'Dine In': 'restaurant',
  };

  const prices = {
    Low: 1,
    Medium: 2,
    High: 3,
    'Very High': 4,
  };

  return (
    <div className='preference-form-container'>
      {authContext.currentUser.get &&
        !authContext.currentUser.get.isSignedIn() && (
          <div className='preference-form-sign-in'>
            <h4>Sign in for better results.</h4>
            <p>
              By signing in and allowing us to save your preferences, dietary
              restrictions, restaurant history, and more, we can make our
              algorithm stronger and your recommendations better! You will
              always be able to view, edit, or delete any personal data we have
              stored from the profile page.
            </p>
            <button
              onClick={(event) => {
                event.preventDefault();
                authContext.signIn();
              }}>
              Sign in with Google
            </button>
            <div className='preference-form-divider'>
              <div />
              <p>Continue as guest</p>
              <div />
            </div>
          </div>
        )}
      <form className='preference-form' onSubmit={handleSubmit}>
        <h4>Your profile.</h4>
        <div className='preference-form-row'>
          <img src={Place} alt='' />
          <label>Location</label>
          <p>{'Your location'}</p>
        </div>
        <div className='preference-form-row'>
          <img src={Cuisine} alt='' />
          <label htmlFor='cuisine'>Cuisines</label>
          <CuisineAutocomplete
            cuisineOptions={cuisineOptions}
            setCuisine={setCuisine}
          />
        </div>
        <div className='preference-form-row'>
          <div className='preference-form-column'>
            <div className='preference-form-row'>
              <img src={Distance} alt='' />
              <label htmlFor='radius'>Distance</label>
              {getSelect('radius', radius, setRadius, distancesInMiles)}
            </div>
            <div className='preference-form-row'>
              <img src={Experience} alt='' />
              <label htmlFor='diningExp'>Experience</label>
              {getSelect(
                'diningExp',
                diningExp,
                setDiningExp,
                diningExperiences
              )}
            </div>
            <div className='preference-form-row'>
              <img src={Price} alt='' />
              <label htmlFor='priceLevel'>Price Level</label>
              {getSelect('priceLevel', priceLevel, setPriceLevel, prices)}
            </div>
          </div>
        </div>
        <div
          className='preference-form-row'
          style={{ justifyContent: 'center', margin: '32px 0px' }}>
          <label htmlFor='open'>Open Now</label>
          <input
            name='open'
            type='checkbox'
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
          />
        </div>
        <div className='preference-form-submit-container'>
          <button type='submit'>Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
