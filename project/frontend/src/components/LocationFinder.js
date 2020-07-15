import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

class LocationFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      locationName: '',
      submitted: false,
    };
    this.changeState = this.changeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.geolocate = this.geolocate.bind(this);
  }

  changeState(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const locationData = this.getLocation(this.state.userInput);
    if (locationData) {
      this.props.sendData(locationData);
    }
  }

  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const geolocationBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
        const searchParams = new URLSearchParams();
        searchParams.append('latlng', currLocation.lat + ',' + currLocation.lng);
        searchParams.append('key', process.env.REACT_APP_GOOGLE_API_KEY);
        fetch(proxyUrl + geolocationBaseUrl + searchParams)
          .then((response) => response.json())
          .then((data) => {
            if (data.results) {
              const locationName = data.results[0].formatted_address;
              this.setState({ locationName });
              this.setState({ submitted: true });
              this.props.sendData({ currLocation, locationName });
            } else {
              alert('Cannot find your location');
            }
          });
      });
    } else {
      alert('Cannot find your location');
    }
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
        if (location.error_message) {
          alert('Could not find any results for that location.');
          return false;
        }
        const currLocation = location.results[0].geometry.location;
        const locationName = location.results[0].formatted_address;
        this.setState({ locationName });
        this.setState({ submitted: true });
        
        return { currLocation, locationName };
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.geolocate}>Use My Current Location</button>
        <form onSubmit={this.handleSubmit}>
          <input name='userInput' onChange={this.changeState} />
          <button onClick={this.handleSubmit}>Find Location</button>
        </form>
        {this.state.submitted ? (
          <p>Your current location: {this.state.locationName}</p>
        ) : null}
      </div>
    );
  }
}
export default LocationFinder;
