import React from 'react';

class LocationFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationString: '',
    };
    this.changeState = this.changeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeState(event) {
    this.setState({ locationString: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getLocation(this.state.locationString);
  }

  getLocation(userInput) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const geocodeBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const searchParams = new URLSearchParams();
    searchParams.append('address', userInput);
    searchParams.append('key', process.env.REACT_APP_GOOGLE_API_KEY);
    fetch(proxyUrl + geocodeBaseUrl + searchParams, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((location) => {
        if (!location) {
          alert('Could not find any results for that location.');
          return;
        }
        const currLocation = location.results[0].geometry.location;
        const locationName = location.results[0].formatted_address;
        this.props.sendData({ currLocation, locationName });
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input name='location' onChange={this.changeState} />
        <button onClick={this.handleSubmit}>Find Location</button>
      </form>
    );
  }
}
export default LocationFinder;
