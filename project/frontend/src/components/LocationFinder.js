import React from 'react';

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
    this.getLocation = this.getLocation.bind(this);
  }

  changeState(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getLocation(this.state.userInput, (locationData) => {
      if (locationData) {
        this.props.sendData(locationData);
      }
    });
    
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

  getLocation(userInput, callback) {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: userInput }, (results, status) => {
      if (status === 'OK') {
        const currLocation = { 
          lat: results[0].geometry.location.lat(), 
          lng: results[0].geometry.location.lng(),
         };
        const locationName = results[0].formatted_address;
        this.setState({ locationName });
        this.setState({ submitted: true });
        callback({ currLocation, locationName });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
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
