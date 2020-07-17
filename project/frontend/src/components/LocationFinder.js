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
    this.getLocationFromGeolocate = this.getLocationFromGeolocate.bind(this);
    this.getLocationFromText = this.getLocationFromText.bind(this);
  }

  changeState(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Uses Geolocation to get the user's current coordinates.
   * Gets formatted address to display from Geocoder.
   */
  getLocationFromGeolocate() {
    if (navigator.geolocation) {
      const google = window.google;
      const geocoder = new google.maps.Geocoder();
      navigator.geolocation.getCurrentPosition((position) => {
        const currLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        geocoder.geocode({ location: currLocation }, (results, status) => {
          if (status === 'OK') {
            const locationName = results[0].formatted_address;
            this.setState({ locationName });
            this.setState({ submitted: true });
            this.props.sendData({ currLocation, locationName });
          } else {
            alert(
              'Geocode was not successful for the following reason: ' +
                status +
                '. Try entering a location in the text box below.'
            );
          }
        });
      });
    } else {
      alert(
        'Cannot find your location. Try entering a location in the text box below.'
      );
    }
  }

  /**
   * Uses Geocoder to get location information based on user input.
   */
  getLocationFromText(event) {
    event.preventDefault();
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.state.userInput }, (results, status) => {
      if (status === 'OK') {
        const currLocation = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        const locationName = results[0].formatted_address;
        this.setState({ locationName });
        this.setState({ submitted: true });
        this.props.sendData({ currLocation, locationName });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.getLocationFromGeolocate}>
          Use My Current Location
        </button>
        <form id='get-input-location-form' onSubmit={this.getLocationFromText}>
          <input name='userInput' onChange={this.changeState} />
          <button type='submit'>Find Location</button>
        </form>
        {this.state.submitted ? (
          <p>Your current location: {this.state.locationName}</p>
        ) : null}
      </div>
    );
  }
}
export default LocationFinder;
