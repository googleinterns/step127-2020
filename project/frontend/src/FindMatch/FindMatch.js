import React from 'react';

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisine: [],
      distance: '',
      dining_experience: '',
      price_level: '',
      latitude: '',
      longitude: '',
      open: true,
    };
    this.changeState = this.changeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Updates the state of the input element so it holds the chosen value.
  changeState(event) {
    let value;
    if (event.target.name === 'cuisine') {
      const cuisineList = this.state.cuisine;
      cuisineList.push(event.target.value);
      value = cuisineList;
    } else if (event.target.name === 'open') {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }
    this.setState({ [event.target.name]: value });
  }

  handleSubmit(event) {
    this.getRecommendation();
    event.preventDefault();
  }

  render() {
    const cuisines = ['Italian', 'Mexican', 'Indian'];
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
        <label for='cuisine'>
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
        <label for='distance'>
          Distance?
          <select
            name='distance'
            id='distance'
            onChange={this.changeState}
            value={this.state.distance}>
            {Object.entries(distances_in_miles).map(([label, value]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
            ;
          </select>
        </label>
        <label for='dining_experience'>
          Dining Experience
          <select
            name='dining_experience'
            id='dining_experience'
            onChange={this.changeState}
            value={this.state.dining_experience}>
            {Object.entries(dining_experiences).map(([label, apiValue]) => (
              <option key={label} value={apiValue}>
                {label}
              </option>
            ))}
            ;
          </select>
        </label>
        <label for='price_level'>
          Price Level
          <select
            name='price_level'
            id='price_level'
            onChange={this.changeState}
            value={this.state.price_level}>
            {Object.entries(prices).map(([level, intLevel]) => (
              <option key={level} value={intLevel}>
                {level}
              </option>
            ))}
            ;
          </select>
        </label>
        <label for='latitude'>
          Latitude
          <input
            type='number'
            id='latitude'
            name='latitude'
            value={this.state.latitude}
            onChange={this.changeState}
            required
          />
        </label>
        <label for='longitude'>
          Longitude
          <input
            type='number'
            id='longitude'
            name='longitude'
            value={this.state.longitude}
            onChange={this.changeState}
            required
          />
        </label>
        <label for='open'>
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

  getRecommendation() {
    const cuisineTypes = this.state.cuisine;
    const milesRadius = parseInt(this.state.distance);
    const radius = this.milesToMeters(milesRadius);
    const priceLevel = parseInt(this.state.price_level);
    const lat = parseFloat(this.state.latitude);
    const lng = parseFloat(this.state.longitude);
    const diningExp = this.state.dining_experience;
    const openNow = this.state.open;
    const priceLevelWeight = 2;
    const diningExpWeight = 4;
    const radiusWeight = 3;

    const promises = this.makePromisesArray(cuisineTypes, lat, lng, radius, openNow);

    Promise.all(promises)
      // This gives us the list of restaurants.
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        let restaurants = [];
        for (const restaurant of data) {
          restaurants = restaurants.concat(restaurant.results);
        }

        fetch('/api/recommendation', {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurants,
            preferences: {
              currLocation: {
                lat,
                lng,
              },
              radius: {
                pref: radius,
                weight: radiusWeight,
              },
              priceLevel: {
                pref: priceLevel,
                weight: priceLevelWeight,
              },
              diningExp: {
                pref: diningExp,
                weight: diningExpWeight,
              },
            },
          }),
        })
          .then((response) => response.text())
          .then((data) => {
            try {
              const selections = JSON.parse(data);
              console.log(selections);
            } catch (err) {
              console.log(err);
            }
          });
      });
  }

  /**
   *  Returns an array of promises of calls to the Google Places API.
   *  One promise is created for every cuisine type.
   */
  makePromisesArray(cuisineTypes, lat, lng, radius, openNow) {
    // TODO: replace API key
    const apiKey = 'AIzaSyBBqtlu5Y3Og7lzC1WI9SFHZr2gJ4iDdTc';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const textSearchBaseUrl =
      'https://maps.googleapis.com/maps/api/place/textsearch/json?';
    const promises = [];
    for (const cuisineType of cuisineTypes) {
      const searchParams = new URLSearchParams();
      searchParams.append('query', cuisineType + ' restaurant');
      searchParams.append('location', lat + ',' + lng);
      searchParams.append('radius', radius);
      if (openNow) {
        searchParams.append('opennow', openNow);
      }
      searchParams.append('key', apiKey);      
      promises.push(fetch(proxyUrl + textSearchBaseUrl + searchParams));
    }
    return promises;
  }

  milesToMeters(numMiles) {
    return numMiles * 1609.34;
  }
}

export default PreferenceForm;
