import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

function MapContainer(props) {
  const [activeMarker, setActiveMarker] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [infoWindowNumber, setInfoWindowNumber] = useState('');
  // TODO: add a conditional to check if the list is empty
  const restaurant = props.restaurant;
  const matchCoords = restaurant[0].key.latLngCoords;

  const onMouseOverMarker = (props, marker) => {
    setActiveMarker(marker);
    setShowInfoWindow(true);
    setInfoWindowNumber(marker.id);
  };

  const onMouseOutMarker = (props) => {
    setShowInfoWindow(false);
  };

  const onClose = (props) => {
    if (showInfoWindow) {
      setShowInfoWindow(false);
    }
  };

  const createMarkers = () => {
    let markers = [];
    const numOfMarkers = 4;
    for (let i = 0; i < numOfMarkers; i++) {
      const coords = restaurant[i].key.latLngCoords;
      markers.push(
        <Marker
          onMouseover={onMouseOverMarker}
          onMouseout={onMouseOutMarker}
          position={coords}
          name={'Your #' + toString(i + 1) + ' Match'}
          id={(i + 1).toString()}
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
          {/* TODO: add the restaurant name */}
          <h5>{'#' + infoWindowNumber}</h5>
        </div>
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);
