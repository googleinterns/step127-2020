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
  }

  changeState(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getLocation(this.state.userInput);
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
        this.setState({ locationName });
        this.setState({ submitted: true });
        this.props.sendData({ currLocation, locationName });
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input name='userInput' onChange={this.changeState} />
          <button onClick={this.handleSubmit}>Find Location</button>
        </form>
        {this.state.submitted ? <p>Your current location: {this.state.locationName}</p> : null}
      </div>
    );
  }
}
export default LocationFinder;
