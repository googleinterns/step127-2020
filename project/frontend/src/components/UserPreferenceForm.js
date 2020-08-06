import './UserPreferenceForm.css';

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
import PreferenceForm from './PreferenceForm';

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

  useEffect(() => {
    (async () => {
      const options = await getLocalCuisines(currLocation);
      setCuisineOptions(options);
    })();
  }, [currLocation]);

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
    console.log('uh ha ha');
    console.log({
      currLocation,
      cuisine,
      radius: { pref: radius, weight: radiusWeight },
      diningExp: { pref: diningExp, weight: diningExpWeight },
      priceLevel: { pref: priceLevel, weight: priceLevelWeight },
      open,
      cuisineOptions,
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

  const openNowCheckBox = () => {
    return (
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
      <h4>Your preferences.</h4>
      <p>
        Please enter your restaurant preferences below. You may leave any field
        blank if you have no preference. Specify an importance to indicate your
        priority for different fields.
      </p>
      {/* TODO: Add handle submit functionality. */}
      <PreferenceForm
        rowItemLabels={{
          cuisine: 'Cuisines',
          location: 'Location',
          experience: 'Experience',
          price: 'Price Level',
          distance: 'Distance',
        }}
        isPreference={true}
        locationName={locationName}
        buttonLabel='Find Match'
        handleSubmit={handleSubmit}
        cuisineOptions={cuisineOptions}
        setCuisine={setCuisine}>
        {getSelect('radius', radius, setRadius, distancesInMiles)}
        {getSelect('priceLevel', priceLevel, setPriceLevel, prices)}
        {getSelect('diningExp', diningExp, setDiningExp, diningExperiences)}
        {getSlider(radiusWeight, setRadiusWeight, radius === '')}
        {getSlider(priceLevelWeight, setPriceLevelWeight, priceLevel === '')}
        {getSlider(diningExpWeight, setDiningExpWeight, diningExp === '')}
        {openNowCheckBox()}
      </PreferenceForm>
      {/* </form> */}
    </div>
  );
}

export default UserPreferenceForm;
