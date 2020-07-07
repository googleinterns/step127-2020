import React from 'react';

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cuisine: '',
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
    const value =
      event.target.name === 'open' ? event.target.checked : event.target.value;
    this.setState({[event.target.name]: value,});
  }

  handleSubmit(event) {
    // TODO: Remove alert and implement.
    alert('the cuisine you chose is: ' + this.state.cuisine);
    event.preventDefault();
  }

  render() {
    const cuisines = ['Italian', 'Mexican', 'Indian'];
    const distances_in_miles = [1, 5, 10, 25];
    const dining_experiences = {
      meal_takeaway: 'Takeout',
      meal_delivery: 'Delivery',
      restaurant: 'Eat In',
    };
    const prices = {'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4,};
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          What cuisine?
          <select
            className='cuisine-type'
            name='cuisine'
            id='cuisine'
            onChange={this.changeState}
            value={this.state.cuisine}
            multiple>
            {cuisines.map((cuisine) => (
              <option value={cuisine}>{cuisine}</option>
            ))}
            ;
          </select>
        </label>
        <label>
          Distance?
          <select
            name='distance'
            id='distance'
            onChange={this.changeState}
            value={this.state.distance}>
            {distances_in_miles.map((distance) => (
              <option value={distance}>{distance + ' mile'}</option>
            ))}
            ;
          </select>
        </label>
        <label>
          Dining Experience
          <select
            name='dining_experience'
            id='dining_experience'
            onChange={this.changeState}
            value={this.state.dining_experience}>
            {dining_experiences.forEach((id, title) => (
              <option value={id}>{title}</option>
            ))}
            ;
          </select>
        </label>
        <label>
          Price Level
          <select
            name='price_level'
            id='price_level'
            onChange={this.changeState}
            value={this.state.price_level}>
            {prices.forEach((title, value) => (
              <option value={value}>{title}</option>
            ))}
            ;
          </select>
        </label>
        <label>
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
        <label>
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
        <label>
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
