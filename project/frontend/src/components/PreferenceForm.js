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
        <FormItem imageName={Distance} label={rowItemLabels.distance}>
          {/** The input types are different for the distance, price and experience so I made this props.children */}
          {props.children[0]}
        </FormItem>
        <FormItem imageName={Price} label={rowItemLabels.price}>
          {props.children[1]}
        </FormItem>
        <FormItem imageName={Experience} label={rowItemLabels.experience}>
          {props.children[2]}
        </FormItem>
        <div className='form-submit-container'>
          <button type='submit'>Update Profile</button>
        </div>
      </form>
    </div>
  );
}
export default PreferenceForm;
