import './UserPreferenceForm.css';

import React, { useState, useEffect, useContext } from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import { Slider } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './Authentication.js';
import PreferenceForm from './PreferenceForm.js';

import Place from '../assets/place.svg';
import Cuisine from '../assets/cuisine.svg';

/**
 * Returns a list of cuisine types of local restaurants using the Zomato API.
 * @see https://developers.zomato.com/api
 *
 * @param {!Object<string, number>} currLocation The latitude and longitude
 *     coordinates of the user in the form {lat: 0.0, lng: 0.0}.
 * @return {!Array<string>} An array of all local cuisine types.
 */
async function getLocalCuisines(currLocation) {
  const baseUrl = 'https://developers.zomato.com/api/v2.1/cuisines?';
  const searchParams = new URLSearchParams();
  searchParams.append('lat', currLocation.lat);
  searchParams.append('lon', currLocation.lng);
  const headers = {
    'content-type': 'application/json',
    'user-key': process.env.REACT_APP_ZOMATO_API_KEY,
  };

  const response = await fetch(baseUrl + searchParams, { headers });
  const data = await response.json();
  if (!data || !data.cuisines) {
    return [];
  }

  return data.cuisines.map((entry) => entry.cuisine.cuisine_name);
}

/**
 * A form used to gather the restaurant preferences of a user for the 'Find My Match'
 * service.
 *
 * @param {!Object<string, number>} currLocation The current latitude and longitude
 *     coordinates of the user.
 * @param {string} locationName The formatted address of the current user.
 */
function UserPreferenceForm(props) {
  const { currLocation, locationName } = props;

  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [cuisine, setCuisine] = useState([]);
  const [radius, setRadius] = useState('');
  const [radiusWeight, setRadiusWeight] = useState(3);
  const [diningExp, setDiningExp] = useState('');
  const [diningExpWeight, setDiningExpWeight] = useState(3);
  const [priceLevel, setPriceLevel] = useState('');
  const [priceLevelWeight, setPriceLevelWeight] = useState(3);
  const [open, setOpen] = useState(true);

  const itemLabels = {
    cuisine: 'Cuisines',
    location: 'Location',
    price: 'Price Level',
    distance: 'Distance',
    experience: 'Dining Experience',
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

  useEffect(() => {
    (async () => {
      const options = await getLocalCuisines(currLocation);
      setCuisineOptions(options);
    })();
  }, [currLocation]);

  const getSlider = (value, setValue, disabled) => {
    return (
      <div className='preference-form-slider-container'>
        <Slider
          defaultValue={value}
          min={1}
          step={1}
          max={5}
          onChange={setValue}
          disabled={disabled}
          graduated
          progress
        />
      </div>
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/match-results',
      state: {
        currLocation,
        cuisine,
        radius: { pref: radius, weight: radiusWeight },
        diningExp: { pref: diningExp, weight: diningExpWeight },
        priceLevel: { pref: priceLevel, weight: priceLevelWeight },
        open,
        cuisineOptions,
      },
    });
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
      <PreferenceForm
        headerLabel='Your Preferences.'
        rowItemLabels={itemLabels}>
        {/* <form className='preference-form' onSubmit={handleSubmit}> */}
        {/* <p>
          Please enter your restaurant preferences below. You may leave any
          field blank if you have no preference. Specify an importance to
          indicate your priority for different fields.
        </p> */}
        <div className='preference-form-column'>
          <div className='preference-form-row'>
            <label>Importance</label>
            {getSlider(radiusWeight, setRadiusWeight, radius === '')}
          </div>
          <div className='preference-form-row'>
            <label>Importance</label>
            {getSlider(diningExpWeight, setDiningExpWeight, diningExp === '')}
          </div>
          <div className='preference-form-row'>
            <label>Importance</label>
            {getSlider(
              priceLevelWeight,
              setPriceLevelWeight,
              priceLevel === ''
            )}
          </div>
        </div>
        {/* <div
          className='preference-form-row'
          style={{ justifyContent: 'center', margin: '32px 0px' }}>
          <label htmlFor='open'>Open Now</label>
          <input
            name='open'
            type='checkbox'
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
          />
        </div> */}
        {/* </form> */}
      </PreferenceForm>
    </div>
  );
}

export default UserPreferenceForm;
