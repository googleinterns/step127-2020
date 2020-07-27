import './LocationFinder.css';

import React from 'react';
import Loading from './Loading.js';
import MyLocation from '../assets/gps.svg';

class LocationFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      locationName: '',
      submitted: false,
      error: false,
      autocomplete: null,
      geolocateLoading: false,
    };
    this.changeState = this.changeState.bind(this);
    this.getLocationFromGeolocate = this.getLocationFromGeolocate.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleGeolocateSuccess = this.handleGeolocateSuccess.bind(this);
    this.handleGeolocateError = this.handleGeolocateError.bind(this);
  }

  componentDidMount() {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('location-finder-autocomplete-input')
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
    this.setState({
      userInput: locationName,
      locationName,
      submitted: true,
      error: false,
    });
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
      navigator.geolocation.getCurrentPosition(
        this.handleGeolocateSuccess,
        this.handleGeolocateError
      );
      this.setState({ geolocateLoading: true });
    } else {
      alert(
        'Cannot find your location. Try entering a location in the text box below.'
      );
    }
  }

  handleGeolocateSuccess(position) {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    const currLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    geocoder.geocode({ location: currLocation }, (results, status) => {
      if (status === 'OK') {
        const locationName = results[0].formatted_address;
        this.setState({
          userInput: locationName,
          locationName,
          submitted: true,
          error: false,
          geolocateLoading: false,
        });
        this.props.sendData({ currLocation, locationName });
      } else {
        this.setState({ error: true, geolocateLoading: false });
        const result = document.getElementById('error-label');
        result.innerHTML =
          'Geocode was not successful for the following reason: ' +
          status +
          '. Try entering a location in the text box below.';
      }
    });
  }

  handleGeolocateError(error) {
    this.setState({ error: true, geolocateLoading: false });
    const result = document.getElementById('error-label');
    if (error.code === 1) {
      result.innerHTML =
        "You've decided not to share your location, but it's OK. We won't ask you again.";
    } else if (error.code === 2) {
      result.innerHTML =
        "The network is down or the location service can't be reached.";
    } else if (error.code === 3) {
      result.innerHTML =
        'The attempt timed out before it could get the location data.';
    } else {
      result.innerHTML = 'Geolocation failed due to unknown error.';
    }
  }

  render() {
    return (
      <div className='location-finder'>
        <div className='location-finder-autocomplete-container'>
          <button
            className='location-finder-my-location'
            onClick={this.getLocationFromGeolocate}>
            {this.state.geolocateLoading ? (
              <Loading />
            ) : (
              <img src={MyLocation} alt='Get your location.' style={{padding: '0px 7px'}} />
            )}
          </button>
          <input
            id='location-finder-autocomplete-input'
            className='location-finder-autocomplete-input'
            name='userInput'
            placeholder='Enter your location'
            value={this.state.userInput}
            onChange={this.changeState}
          />
        </div>
        {this.state.error ? (
          <p id='error-label' className='highlighted-label' />
        ) : null}
      </div>
    );
  }
}
export default LocationFinder;
