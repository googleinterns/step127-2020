import { Map, GoogleApiWrapper } from 'google-maps-react';
import React from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    // TODO: change this to be the first match coordinates
    this.state = { lat: 40.837, lng: -73.865 };
    this.changeCenter = this.changeCenter.bind(this);
  }

  changeCenter() {
    // TODO: change this to read off of the returned restaurants
    this.setState({ lat: 37.419, lng: -122.078 });
  }

  render() {
    const { lat, lng } = this.state;
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyle}
        center={(lat, lng)}
      />
    );
  }
}

export default GoogleApiWrapper({
  // TODO: change this to be an imported key var when the
  // root file is created.
  apiKey: 'AIzaSyC0Q4CyO-BM4M5jPvL3ayJ09RfymZYQjhs',
})(MapContainer);
