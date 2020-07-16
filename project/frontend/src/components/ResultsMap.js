import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '100%',
  width: '100%',
};

function MapContainer(props) {
  const [activeMarker, setActiveMarker] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const restaurants = props.restaurants;
  const userCenter = props.userLocation;

  const onMarkerClick = (props, marker) => {
    setActiveMarker(marker);
    setShowInfoWindow(true);
  };

  const onClose = () => {
    if (showInfoWindow) {
      setShowInfoWindow(false);
    }
  };

  const createMarkers = () => {
    if (restaurants.length >= 1) {
      let markers = [];
      const numOfMarkers = Math.min(restaurants.length, 4);
      for (let i = 0; i < numOfMarkers; i++) {
        const coords = restaurants[i].key.latLngCoords;
        markers.push(
          <Marker
            onClick={onMarkerClick}
            position={coords}
            name={'Your #' + toString(i + 1) + ' Match'}
            aria-label={'Your #' + toString(i + 1) + ' Match'}
          />
        );
      }
      return markers;
    }
  };

  return (
    <Map
      aria-label={'A Google Map with your Matches!'}
      google={props.google}
      zoom={10}
      style={mapStyle}
      initialCenter={userCenter}>
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
