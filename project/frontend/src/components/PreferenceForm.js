import React from 'react';

import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
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
      cuisineOptions: [],
    };
    this.changeState = this.changeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUpdate() {
    const { currLocation } = this.state;
    if (
      this.props.currLocation.lat &&
      this.props.currLocation.lng &&
      (currLocation['lat'] !== this.props.currLocation.lat ||
        currLocation['lng'] !== this.props.currLocation.lng)
    ) {
      currLocation['lat'] = this.props.currLocation.lat;
      currLocation['lng'] = this.props.currLocation.lng;
      this.setState({ currLocation });
      const cuisineOptions = this.getCuisines();
      this.setState({ cuisineOptions });
    }
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

  getCuisines() {
    const baseUrl = 'https://developers.zomato.com/api/v2.1/cuisines?';
    const searchParams = new URLSearchParams();
    searchParams.append('lat', this.props.currLocation.lat);
    searchParams.append('lon', this.props.currLocation.lng);
    const headers = {
      'content-type': 'application/json',
      'user-key': process.env.REACT_APP_ZOMATO_API_KEY,
    };
    fetch(baseUrl + searchParams, { headers })
      .then((response) => response.json())
      .then((data) => {
        // If there are no cuisines found we will have no autocomplete options.
        // No need for error message as user can still enter their own cuisines.
        if (!data || !data['cuisines']) {
          return;
        }
        const cuisines = [];
        data['cuisines'].forEach((entry) =>
          cuisines.push(entry.cuisine.cuisine_name)
        );
        this.setState({ cuisineOptions: cuisines });
      });
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
          disabled={!this.state[attrName]['pref']}
        />
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push({
      pathname: '/match-results',
      state: this.state,
    });
  }

  inputIsNewAndValid(input, options) {
    const trimmedInput = input.trim();
    return (
      trimmedInput !== '' &&
      trimmedInput.length < 25 &&
      // RegEx to make sure input is only chars and spaces.
      /^[a-z\s]+$/i.test(trimmedInput) &&
      // Make sure we don't display duplicates.
      !(options.includes(trimmedInput) && options.includes(input))
    );
  }

  showCuisineOptions() {
    const filter = createFilterOptions();
    if (this.state.cuisineOptions) {
      return (
        <Autocomplete
          multiple
          name='cuisine'
          id='cuisine'
          options={this.state.cuisineOptions}
          onChange={(_event, newCuisineList) => {
            this.setState({ cuisine: newCuisineList });
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (this.inputIsNewAndValid(params.inputValue, options)) {
              filtered.push(params.inputValue.trim());
            }
            return filtered;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              placeholder='Select Cuisine Types'
            />
          )}
        />
      );
    }
    return null;
  }

  render() {
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
          {this.showCuisineOptions()}
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
