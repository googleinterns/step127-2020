import './PreferenceForm.css';

import React from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import FormItem from './FormItem.js';

import Place from '../assets/place.svg';
import Cuisine from '../assets/cuisine.svg';
import Distance from '../assets/distance.svg';
import Experience from '../assets/food_service.svg';
import Price from '../assets/dollar.svg';

/**
 * A form used to help gather user preferences for the 'Find My Match' and Profile Page.
 *
 * @param {!Object<string, string>} rowItemLabels The labels for each form input item.
 * @param {boolean} isUserPreference  True if the use of this form is for the user
 *      preference form on the home page.
 * @param {string} locationName The formatted address of the current user.
 * @param {string} buttonLabel The label on the submit button.
 * @param {function} handleSubmit The function called when the submit button is pressed.
 * @param {!Array<string>} cuisineOptions The list of cuisines that will be shown
 *      in the cuisine autocomplete component.
 * @param {function} setCuisine A cuisine setter function that will update
 *      when something is added to autocomplete.
 */
function PreferenceForm(props) {
  const {
    rowItemLabels,
    isUserPreference,
    locationName,
    buttonLabel,
    handleSubmit,
    cuisineOptions,
    setCuisine,
  } = props;
  return (
    <div className='preference-form-container'>
      <form className='preference-form' onSubmit={handleSubmit}>
        <FormItem imageName={Place} label={rowItemLabels.location}>
          <p>{locationName}</p>
        </FormItem>
        <FormItem imageName={Cuisine} label={rowItemLabels.cuisine}>
          <CuisineAutocomplete
            cuisineOptions={cuisineOptions}
            setCuisine={setCuisine}
          />
        </FormItem>
        <div className='preference-form-row'>
          <div className='preference-form-column'>
            <FormItem imageName={Distance} label={rowItemLabels.distance}>
              {props.children[0]}
            </FormItem>
            <FormItem imageName={Price} label={rowItemLabels.price}>
              {props.children[1]}
            </FormItem>
            <FormItem imageName={Experience} label={rowItemLabels.experience}>
              {props.children[2]}
            </FormItem>
          </div>
          {isUserPreference && (
            <div className='preference-form-column'>
              <div className='preference-form-row'>
                <label>Importance</label>
                {props.children[3]}
              </div>
              <div className='preference-form-row'>
                <label>Importance</label>
                {props.children[4]}
              </div>
              <div className='preference-form-row'>
                <label>Importance</label>
                {props.children[5]}
              </div>
            </div>
          )}
        </div>
        {isUserPreference && props.children[6]}
        <div className='preference-form-submit-container'>
          <button type='submit'>{buttonLabel}</button>
        </div>
      </form>
    </div>
  );
}
export default PreferenceForm;
