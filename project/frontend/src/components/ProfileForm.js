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

  return (
    <div className='preference-form-container'>
      <form className='preference-form' onSubmit={handleSubmit}>
        <h4>Your profile.</h4>
        <div className='preference-form-row'>
          <img src={Place} alt='' />
          <label>Location</label>
          {/* TODO: change so that if a location isn't inputted then we are going to need to have a fill in optiob. */}
          <p>Your location</p>
        </div>
        <div className='preference-form-row'>
          <img src={Cuisine} alt='' />
          <label htmlFor='cuisine'>Preffered Cuisines</label>
          <CuisineAutocomplete
            cuisineOptions={cuisineOptions}
            setCuisine={setCuisine}
          />
        </div>
        <div className='preference-form-row'>
          <img src={Distance} alt='' />
          <label htmlFor='distance'>Ideal Distance</label>
          <div class='btn-group'>
            <button>$</button>
            <button>$$</button>
            <button>$$$</button>
            <button>$$$$</button>
          </div>
        </div>
        <div className='preference-form-submit-container'>
          <button type='submit'>Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
