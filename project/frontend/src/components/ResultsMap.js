import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

function MapContainer(props) {
  const [activeMarker, changeMarker] = useState({});
  const [showInfoWindow, changeInfoVisibility] = useState(false);
  const restaurant = props.restaurant;

  const coords = { lat: 40.837, lng: -73.865 };

  const onMarkerClick = (props, marker) => {
    changeMarker(marker);
    changeInfoVisibility(true);
  };

  const onClose = (props) => {
    if (showInfoWindow) {
      changeInfoVisibility(false);
    }
  };

  return (
    <Map
      aria-label={'A Google Map with your Matches!'}
      google={props.google}
      zoom={14}
      style={mapStyle}
      initialCenter={coords}>
      <Marker
        onClick={onMarkerClick}
        name={'Your #1 Match'}
        aria-label={'Your #1 Match Marker'}
      />
      <InfoWindow
        marker={activeMarker}
        visible={showInfoWindow}
        onClose={onClose}
        aria-label={'Your #1 Match Info Window'}>
        <div>
          <h5>{'Your #1 Match'}</h5>
        </div>
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);
