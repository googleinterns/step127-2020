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
  const {
    headerLabel,
    rowItemLabels,
    isPreference,
    locationName,
    buttonLabel,
    handleSubmit,
    cuisineOptions,
    setCuisine,
  } = props;
  // const [cuisine, setCuisine] = useState([]);
  return (
    <div className='form-container'>
      <form className='form' onSubmit={handleSubmit}>
        <h4 className='header'>{headerLabel}</h4>
        <FormItem imageName={Place} label={rowItemLabels.location}>
          <p>{locationName}</p>
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
<<<<<<< HEAD
              {props.children[0]}
            </FormItem>
            <FormItem imageName={Price} label={rowItemLabels.price}>
              {props.children[1]}
            </FormItem>
            <FormItem imageName={Experience} label={rowItemLabels.experience}>
              {props.children[2]}
            </FormItem>
          </div>
          {isPreference && (
            <div className='form-column'>
              <div className='form-row'>
                <label>Importance</label>
                {props.children[3]}
              </div>
              <div className='form-row'>
                <label>Importance</label>
                {props.children[4]}
              </div>
              <div className='form-row'>
                <label>Importance</label>
                {props.children[5]}
              </div>
            </div>
          )}
        </div>
        {isPreference && props.children[6]}
=======
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
>>>>>>> 0dbad3ac669cfd56812b356aefb36461f144ecfb
        <div className='form-submit-container'>
          <button type='submit'>{buttonLabel}</button>
        </div>
      </form>
    </div>
  );
}
export default PreferenceForm;
