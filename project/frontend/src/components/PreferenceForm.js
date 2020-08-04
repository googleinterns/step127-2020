import './PreferenceForm.css';
import './FormItem.js';
import React, { useState } from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import FormItem from './FormItem.js';

import Place from '../assets/place.svg';
import Cuisine from '../assets/cuisine.svg';
import Distance from '../assets/distance.svg';
import Experience from '../assets/food_service.svg';
import Price from '../assets/dollar.svg';

function PreferenceForm(props) {
  const { headerLabel, rowItemLabels } = props;
  const cuisineOptions = ['Italian', 'Mexican'];
  const [cuisine, setCuisine] = useState([]);
  const [radius, setRadius] = useState('');
  const [diningExp, setDiningExp] = useState('');
  const [priceLevel, setPriceLevel] = useState('');
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
    <div className='form-container'>
      <form className='form'>
        <h4 className='header'>{headerLabel}</h4>
        <FormItem imageName={Place} label={rowItemLabels.location}>
          <p>Your Location</p>
        </FormItem>
        <FormItem imageName={Cuisine} label={rowItemLabels.cuisine}>
          <CuisineAutocomplete
            cuisineOptions={cuisineOptions}
            setCuisine={setCuisine}
          />
        </FormItem>
        <div className='form-row'>
          <div className='form-column'>
            <FormItem imageName={Distance} label={rowItemLabels.distance}>
              {getSelect('radius', radius, setRadius, distancesInMiles)}
            </FormItem>
            <FormItem imageName={Price} label={rowItemLabels.price}>
              {getSelect('priceLevel', priceLevel, setPriceLevel, prices)}
            </FormItem>
            <FormItem imageName={Experience} label={rowItemLabels.experience}>
              {getSelect(
                'diningExp',
                diningExp,
                setDiningExp,
                diningExperiences
              )}
            </FormItem>
          </div>
          {props.children}
        </div>
        <div className='form-submit-container'>
          <button type='submit'>Update Profile</button>
        </div>
      </form>
    </div>
  );
}
export default PreferenceForm;
