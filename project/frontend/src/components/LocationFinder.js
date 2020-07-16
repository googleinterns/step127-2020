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
      const google = window.google;
      const geocoder = new google.maps.Geocoder();
      navigator.geolocation.getCurrentPosition((position) => {
        const currLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        geocoder.geocode({ location: currLocation }, (results, status) => {
          if (status == 'OK') {
            const locationName = results[0].formatted_address;
            this.setState({ locationName });
            this.setState({ submitted: true });
            this.props.sendData({ currLocation, locationName });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
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
