import React, { Fragment, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const restaurants = props.restaurants;
  const userCenter = props.userLocation;
  const [activeMarker, setActiveMarker] = useState({});
  const [showInfoWindows, setShowInfoWindows] = useState({
    marker1: false,
    marker2: false,
    marker3: false,
    marker4: false,
  });

  // TODO: Add marker for "you are here location".
  const MarkerIcon = (props) => {
    const markerName = 'marker' + props.id;
    return (
      <Fragment>
        <img src={Lunch} alt={'lunch icon'} />
        {showInfoWindows[markerName] && <InfoWindow marker={activeMarker} />}
      </Fragment>
    );
  };

  const InfoWindow = (props) => {
    // TODO: Remove hard coded data and add name and percent match from the backend.
    const restaurantName = 'Applebees';
    const percentMatch = '96%';
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
    const markerName = 'marker' + marker.id;
    let showInfoWindowsChange = showInfoWindows;
    setActiveMarker(marker);
    showInfoWindowsChange[markerName] = true;
    setShowInfoWindows(showInfoWindowsChange);
  };

  const onMouseLeaveMarker = (props, marker) => {
    const markerName = 'marker' + marker.id;
    let showInfoWindowsChange = showInfoWindows;
    showInfoWindowsChange[markerName] = false;
    setShowInfoWindows(showInfoWindowsChange);
  };

  const mapStyle = { height: '100vh', width: '50%' };
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
