import React from 'react';
import MyLocation from '@material-ui/icons/MyLocation';

class LocationFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      locationName: '',
      submitted: false,
      autocomplete: null,
    };
    this.changeState = this.changeState.bind(this);
    this.getLocationFromGeolocate = this.getLocationFromGeolocate.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
  }

  componentDidMount() {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete-input')
    );
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect() {
    const addressObj = this.autocomplete.getPlace();
    const locationName = addressObj.formatted_address;
    const currLocation = {
      lat: addressObj.geometry.location.lat(),
      lng: addressObj.geometry.location.lng(),
    };
    this.setState({ locationName });
    this.setState({ submitted: true });
    this.props.sendData({ currLocation, locationName });
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

  render() {
    return (
      <div>
        <label htmlFor='autocomplete-input' />
        <input
          id='autocomplete-input'
          name='userInput'
          onChange={this.changeState}
        />
        <button onClick={this.getLocationFromGeolocate}>
          <MyLocation />
        </button>
        {this.state.submitted ? (
          <p id='location-label'>
            Your current location: {this.state.locationName}
          </p>
        ) : null}
      </div>
    );
  }
}
export default LocationFinder;
