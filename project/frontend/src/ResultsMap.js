import { Map, GoogleApiWrapper } from 'google-maps-react';
import React from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

function MapContainer(props) {
  const coords = {lat:, lng: };
  return (
    <Map
      google={props.google}
      zoom={14}
      style={mapStyle}
      center={{
        lat: -1.2884,
        lng: 36.8233,
      }}
    />
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);
