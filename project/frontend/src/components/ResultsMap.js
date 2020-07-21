import React from 'react';
import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const restaurants = props.restaurants;
  const userCenter = props.userLocation;
  const apple = 5;

  const MarkerIcon = () => <img src={Lunch} alt='Lunch icon' />;

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
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
      defaultCenter={userCenter}
      defaultZoom={10}
      style={mapStyle}
      aria-label={'Google Map with top 4 restaurant markers.'}>
      {createMarkers()}
    </GoogleMapReact>
  );
}

export default MapContainer;
