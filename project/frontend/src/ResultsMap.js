import { Map, GoogleApiWrapper } from 'google-maps-react';
import React from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

export class MapContainer extends React.Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyle}
        initialCenter={{
          lat: -1.2884,
          lng: 36.8233,
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ProcessingInstruction.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);
