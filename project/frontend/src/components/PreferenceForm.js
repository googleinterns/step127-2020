import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Slider } from 'rsuite';

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisine: [],
      radius: {
        pref: '',
        weight: 3,
      },
      diningExp: {
        pref: '',
        weight: 3,
      },
      priceLevel: {
        pref: '',
        weight: 3,
      },
      currLocation: {
        lat: '',
        lng: '',
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
      cuisineList.push(event.target.innerHTML);
      this.setState({ [event.target.name]: cuisineList });
    } else if (event.target.name === 'open') {
      this.setState({ [event.target.name]: event.target.checked });
    } else {
      field['pref'] =
        event.target.name === 'diningExp'
          ? event.target.value
          : parseInt(event.target.value);
      this.setState({ [event.target.name]: field });
    }
  }

  changeWeightState(attrName, value) {
    const field = this.state[attrName];
    field['weight'] = value;
    this.setState({ [attrName]: field });
  }

  getSlider(attrName) {
    return (
      <div style={{ width: 200, padding: 20 }}>
        <Slider
          defaultValue={this.state[attrName]['weight']}
          min={1}
          step={1}
          max={5}
          graduated
          progress
          onChange={(val) => this.changeWeightState(attrName, val)}
          disabled={!Boolean(this.state[attrName]['pref'])}
        />
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    const { currLocation } = this.state;
    currLocation['lat'] = this.props.currLocation.lat;
    currLocation['lng'] = this.props.currLocation.lng;
    this.setState({ currLocation });
    console.log(this.state);
    this.props.history.push({
      pathname: '/match-results',
      state: this.state,
    });
  }

  render() {
    const cuisines = ['Italian', 'Mexican', 'Indian'];
    const distancesInMiles = {
      '1 mile': 1,
      '5 miles': 5,
      '10 miles': 10,
      '25 miles': 25,
    };
    const diningExperiences = {
      Takeout: 'meal_takeaway',
      Delivery: 'meal_delivery',
      'Eat In': 'restaurant',
    };
    const prices = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Your current location: {this.props.locationName}</p>
        <label htmlFor='cuisine'>
          What cuisine?
          <Autocomplete
            multiple
            name='cuisine'
            id='cuisine'
            options={cuisines}
            onChange={(_event, newCuisineList) => {
              this.setState({ cuisine: newCuisineList });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='standard'
                placeholder='Select Cuisine Types'
              />
            )}
          />
        </label>
        <label htmlFor='radius'>
          Distance?
          <select
            name='radius'
            className='pref'
            onChange={this.changeState}
            value={this.state.radius.pref}>
            <option label='Select...' key='default' value={''} />
            {Object.entries(distancesInMiles).map(([label, value]) => (
              <option label={label} key={label} value={value} />
            ))}
            ;
          </select>
          <br />
          Importance
          {this.getSlider('radius')}
        </label>
        <label htmlFor='diningExp'>
          Dining Experience
          <select
            name='diningExp'
            className='pref'
            onChange={this.changeState}
            value={this.state.diningExp.pref}>
            <option label='Select...' key='default' value={''} />
            {Object.entries(diningExperiences).map(([label, apiValue]) => (
              <option label={label} key={label} value={apiValue} />
            ))}
            ;
          </select>
          <br />
          Importance
          {this.getSlider('diningExp')}
        </label>
        <label htmlFor='priceLevel'>
          Price Level
          <select
            name='priceLevel'
            className='pref'
            onChange={this.changeState}
            value={this.state.priceLevel.pref}>
            <option label='Select...' key='default' value={''} />
            {Object.entries(prices).map(([level, intLevel]) => (
              <option label={level} key={level} value={intLevel} />
            ))}
            ;
          </select>
          <br />
          Importance
          {this.getSlider('priceLevel')}
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
