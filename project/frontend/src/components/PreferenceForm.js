import React from 'react';
import getRecommendation from '../scripts/recommendation_script.js';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisine: [],
      radius: {
        pref: null,
        weight: 3,
      },
      diningExp: {
        pref: null,
        weight: 3,
      },
      priceLevel: {
        pref: null,
        weight: 3,
      },
      currLocation: {
        lat: null,
        lng: null,
      },
      open: true,
    };
    this.changeState = this.changeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Updates the state of the input element so it holds the chosen value.
  changeState(event) {
    const field = this.state[event.target.name];
    if (event.target.name === 'cuisine') {
      const cuisineList = this.state.cuisine;
      cuisineList.push(event.target.value);
      this.setState({ [event.target.name]: cuisineList });
    } else if (event.target.name === 'open') {
      this.setState({ [event.target.name]: event.target.checked });
    } else if (event.target.name === 'currLocation') {
      field[event.target.id] = parseFloat(event.target.value);
      this.setState({ [event.target.name]: field });
    } else if (event.target.name === 'diningExp' && event.target.className === 'pref') {
      field[event.target.className] =  event.target.value;
      this.setState({ [event.target.name]: field });
    } else {
      field[event.target.className] = parseInt(event.target.value);
      this.setState({ [event.target.name]: field });
    }
  }

  handleSubmit(event) {
    getRecommendation(/* preferences= */ this.state);
    event.preventDefault();
  }

  render() {
    const cuisines = ['Italian ', 'Mexican ', 'Indian '];
    const distances_in_miles = {
      '1 mile': 1,
      '5 miles': 5,
      '10 miles': 10,
      '25 miles': 25,
    };
    const dining_experiences = {
      Takeout: 'meal_takeaway',
      Delivery: 'meal_delivery',
      'Eat In': 'restaurant',
    };
    const prices = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor='cuisine'>
          What cuisine?
          <select
            className='cuisine-type'
            name='cuisine'
            id='cuisine'
            onChange={this.changeState}
            value={this.state.cuisine}
            multiple>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
            ;
          </select>
        </label>
        <label htmlFor='radius'>
          Distance?
          <select
            name='radius'
            className='pref'
            onChange={this.changeState}
            value={this.state.radius}>
            {Object.entries(distances_in_miles).map(([label, value]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
            ;
          </select>
          Importance
          <input 
            name='radius' 
            className='weight'
            onChange={this.changeState}
            value={this.state.radius.weight}
            type='number'
            min={1}
            max={5}
            step={1}
          />
        </label>
        <label htmlFor='diningExp'>
          Dining Experience
            <select
              name='diningExp'
              className='pref'
              onChange={this.changeState}
              value={this.state.diningExp}>
              {Object.entries(dining_experiences).map(([label, apiValue]) => (
                <option key={label} value={apiValue}>
                  {label}
                </option>
              ))}
              ;
            </select>
          Importance
          <input 
            name='diningExp' 
            className='weight'
            onChange={this.changeState}
            value={this.state.diningExp.weight}
            type='number'
            min={1}
            max={5}
            step={1}
          />
        </label>
        <label htmlFor='priceLevel'>
          Price Level
          <select
            name='priceLevel'
            className='pref'
            onChange={this.changeState}
            value={this.state.priceLevel}>
            {Object.entries(prices).map(([level, intLevel]) => (
              <option key={level} value={intLevel}>
                {level}
              </option>
            ))}
            ;
          </select>
          Importance
          <input 
            name='priceLevel' 
            className='weight'
            onChange={this.changeState}
            value={this.state.priceLevel.weight}
            type='number'
            min={1}
            max={5}
            step={1}
          />
        </label>
        <label htmlFor='lat'>
          Latitude
          <input
            type='number'
            id='lat'
            name='currLocation'
            value={this.state.lat}
            onChange={this.changeState}
            required
          />
        </label>
        <label htmlFor='lng'>
          Longitude
          <input
            type='number'
            id='lng'
            name='currLocation'
            value={this.state.lng}
            onChange={this.changeState}
            required
          />
        </label>
        <label htmlFor='open'>
          Open Now?
          <input
            name='open'
            type='checkbox'
            checked={this.state.open}
            onChange={this.changeState}
          />
        </label>
        <button type='submit'>Submit</button>
      </form>
    );
  }
}

export default PreferenceForm;
