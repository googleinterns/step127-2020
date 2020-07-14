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
  const matchCoords = restaurant[0].key.latLngCoords;

  const onMarkerClick = (props, marker) => {
    changeMarker(marker);
    changeInfoVisibility(true);
  };

  const onClose = (props) => {
    if (showInfoWindow) {
      changeInfoVisibility(false);
    }
  };

  const createMarkers = () => {
    let markers = [];
    const numOfMarkers = 4;
    for (let i = 0; i < numOfMarkers; i++) {
      const coords = restaurant[i].key.latLngCoords;
      markers.push(
        <Marker
          onClick={onMarkerClick}
          position={coords}
          name={'Your #' + toString(i + 1) + ' Match'}
        />
      );
    }
    console.log(markers);
    return markers;
  };

  return (
    <Map
      aria-label={'A Google Map with your Matches!'}
      google={props.google}
      zoom={10}
      style={mapStyle}
      initialCenter={matchCoords}>
      {createMarkers()}
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
