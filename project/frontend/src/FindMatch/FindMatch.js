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
    this.setState({ [event.target.name]: value });
  }

  handleSubmit(event) {
    alert('the cuisine you chose is: ' + this.state.cuisine);
    event.preventDefault();
  }

  render() {
    const cuisines = ['italian', 'mexican', 'indian'];
    const distances = [1, 5, 10, 25];
    const dining_experiences = {
      meal_takeaway: 'Takeout',
      meal_delivery: 'Delivery',
      restaurant: 'Eat In',
    };
    const prices = ['Low', 'Medium', 'High'];
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          What cuisine?
          <select
            name='cuisine'
            id='cuisine'
            onChange={this.changeState}
            value={this.state.cuisine}>
            {cuisines.map((cuisine) => (
              <option value={cuisine}>
                {cuisine[0].toUpperCase() + cuisine.slice(1)}
              </option>
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
            {distances.map((distance) => (
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
            {prices.map((price) => (
              <option value={price}>{price}</option>
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
