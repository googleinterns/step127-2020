import React, { Fragment, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const restaurants = props.restaurants;
  const userCenter = props.userLocation;
  const [activeMarker, setActiveMarker] = useState({});
  const [showInfoWindows, setShowInfoWindows] = useState([
    false,
    false,
    false,
    false,
  ]);

  // TODO: Add marker for "you are here location".
  const MarkerIcon = (props) => {
    const markerIndex = props.id;
    const currentRestaurant = restaurants[markerIndex];
    const percentValue = Math.round(currentRestaurant.value * 100);
    return (
      <Fragment>
        <img src={Lunch} alt={'lunch icon'} />
        {showInfoWindows[markerIndex] && (
          <InfoWindow
            marker={activeMarker}
            restaurantName={currentRestaurant.key.name}
            percentMatch={percentValue + '%'}
            aria-label={'Info Window for ' + currentRestaurant.key.Name}
          />
        )}
      </Fragment>
    );
  };

  const InfoWindow = (props) => {
    const restaurantName = props.restaurantName;
    const percentMatch = props.percentMatch;
    const infoWindowStyle = {
      position: 'relative',
      bottom: 80,
      left: '-45px',
      width: 220,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };

    return (
      <div style={infoWindowStyle}>
        <div style={{ fontSize: 16 }}>
          <span style={{ float: 'right' }}>{percentMatch}</span>
          {restaurantName}
        </div>
      </div>
    );
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
          lat={coords.lat}
          lng={coords.lng}
          id={i}
          aria-label={'Your #' + numInList + ' Match'}
        />
      );
    }
    return markers;
  };

  const onMouseEnterMarker = (props, marker) => {
    setActiveMarker(marker);
    let showInfoWindowsChange = showInfoWindows;
    showInfoWindowsChange[marker.id] = true;
    setShowInfoWindows(showInfoWindowsChange);
  };

  const onMouseLeaveMarker = (props, marker) => {
    let showInfoWindowsChange = showInfoWindows;
    showInfoWindowsChange[marker.id] = false;
    setShowInfoWindows(showInfoWindowsChange);
  };

  const mapStyle = { height: '100%', width: '50%' };
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
      defaultCenter={userCenter}
      defaultZoom={10}
      style={mapStyle}
      onChildMouseEnter={onMouseEnterMarker}
      onChildMouseLeave={onMouseLeaveMarker}
      aria-label={'Google Map with top 4 restaurant markers.'}>
      {createMarkers()}
    </GoogleMapReact>
  );
}

export default MapContainer;
