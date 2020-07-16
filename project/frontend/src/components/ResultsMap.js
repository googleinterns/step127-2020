import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const [activeMarker, setActiveMarker] = useState({});
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [infoWindowNumber, setInfoWindowNumber] = useState('');
  const [displayName, setDisplayName] = useState('');

  const restaurants = props.restaurants;
  const userCenter = props.userLocation;
  let nameList = [];

  const MarkerIcon = () => <img src={Lunch} alt='Lunch icon' />;

  const onMouseOverMarker = (props, marker) => {
    setActiveMarker(marker);
    setShowInfoWindow(true);
    setInfoWindowNumber(marker.id);
    setDisplayName(nameList[marker.id - 1]);
  };

  const onMouseOutMarker = () => {
    setShowInfoWindow(false);
  };

  const createMarkers = () => {
    if (!restaurants) {
      return;
    }
    let markers = [];
    const numOfMarkers = Math.min(restaurants.length, 4);
    for (let i = 0; i < numOfMarkers; i++) {
      const coords = restaurants[i].key.latLngCoords;
      const numInList = (i + 1).toString();
      markers.push(
        <MarkerIcon
          onMouseover={onMouseOverMarker}
          onMouseout={onMouseOutMarker}
          lat={coords.lat}
          lng={coords.lng}
          id={numInList}
          name={'Your #' + numInList + ' Match'}
          aria-label={'Your #' + numInList + ' Match'}
        />
      );
      return markers;
    }
  };
  const mapStyle = { height: '100%', width: '50%' };
  // TODO: add aria-labels!!
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
      defaultCenter={userCenter}
      defaultZoom={10}
      style={mapStyle}>
      {createMarkers()}
    </GoogleMapReact>
  );
}

export default MapContainer;
