import './PreferenceForm.css';

import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';

import CuisineAutocomplete from './CuisineAutocomplete.js';
import { Slider } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './Authentication.js';
import { withStyles } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import Place from '../assets/place.svg';
import Cuisine from '../assets/cuisine.svg';
import Distance from '../assets/distance.svg';
import Experience from '../assets/food_service.svg';
import Price from '../assets/dollar.svg';

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
function PreferenceForm(props) {
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

  useLayoutEffect(() => {
    setTooltipVals([radiusWeight, diningExpWeight, priceLevelWeight]);
  }, [radiusWeight, diningExpWeight, priceLevelWeight]);

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

  const setTooltipVals = (prefWeights) => {
    const levels = ['Least', 'Less', 'Medium', 'More', 'Most'];
    const tooltips = document.getElementsByClassName('rs-tooltip-inner');
    for (let i = 0; i < prefWeights.length; i++) {
      if (i >= tooltips.length) {
        return;
      }
      tooltips[i].innerHTML = levels[prefWeights[i] - 1];
    }
  };

  const distancesInMiles = {
    '1 mile': 1,
    '5 miles': 5,
    '10 miles': 10,
    '25 miles': 25,
  };

  const diningExperiences = {
    'Takeout': 'meal_takeaway',
    'Delivery': 'meal_delivery',
    'Dine In': 'restaurant',
  };

  const prices = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Very High': 4,
  };

  const tooltipInfo = 
  (<React.Fragment>
    <p>We will use your preferences entered here to find a restaurant we think you'd like.</p>
    <p>You may leave any field blank if you have no preference for that field. If you are looking for a 
      specific cuisine(s), you may specify up to 10 cuisines in the box. If you leave this 
      box blank, we will consider restaurants of any cuisine type for you.
    </p>
    <p>
      You can also tell us how important each preference you indicate on the form is using the slider next to it.
    </p>
  </React.Fragment>)

  const StyledTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(20),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

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
        <h4>
          Your preferences. 
          <StyledTooltip title={tooltipInfo} interactive>
            <Info />
          </StyledTooltip>
        </h4>
        <p>
          Please enter your restaurant preferences below. You may leave any
          field blank if you have no preference. Specify an importance to
          indicate your priority for different fields.
        </p>
        <div className='preference-form-row'>
          <img src={Place} alt='' />
          <label>Location</label>
          <p>{locationName}</p>
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
          <button type='submit'>Find my match</button>
        </div>
      </form>
    </div>
  );
}

export default PreferenceForm;
