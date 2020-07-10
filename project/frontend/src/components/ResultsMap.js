import { Map, GoogleApiWrapper } from 'google-maps-react';
import React from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

function MapContainer(props) {
  const coords = { lat: 40.837, lng: -73.865 };
  return (
    <Map
      aria-label={'A Google Map with your Matches!'}
      google={props.google}
      zoom={14}
      style={mapStyle}
      center={coords}
    />
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);
