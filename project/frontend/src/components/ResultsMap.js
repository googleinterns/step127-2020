import React, { Fragment, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const {
    restaurants,
    currentCardIndex,
    setCurrentCardIndex,
    userLocation,
  } = props;
  const center =
    restaurants.length === 0
      ? userLocation
      : restaurants[currentCardIndex].key.latLngCoords;
  const [mapCenter, setMapCenter] = useState(center);
  const [showInfoWindows, setShowInfoWindows] = useState({
    marker0: false,
    marker1: false,
    marker2: false,
    marker3: false,
    marker4: false,
    marker5: false,
    marker6: false,
  });

  // TODO: Add marker for "you are here location".
  const MarkerIcon = (props) => {
    const markerID = props.id;
    const markerName = 'marker' + markerID;
    // TODO: Check the casing of the restaurant name (some come back all caps).
    const restaurantName = restaurants[markerID].key.name;
    const percentValue = Math.round(restaurants[markerID].value * 100);
    return (
      <Fragment>
        <img src={Lunch} alt={'lunch icon'} />
        {showInfoWindows[markerName] && (
          <InfoWindow
            restaurantName={restaurantName}
            percentMatch={percentValue + '%'}
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

  // TODO: add a spec here to explain what's happening.
  const createMarkers = () => {
    if (restaurants.length === 0) {
      return;
    }
    const markers = [];
    let coords = restaurants[currentCardIndex].key.latLngCoords;
    markers.push(
      <MarkerIcon
        lat={coords.lat}
        lng={coords.lng}
        id={currentCardIndex}
        aria-label={'Your #' + currentCardIndex + ' Match'}
      />
    );
    const numOfMarkers = Math.min(restaurants.length, 3);
    for (let i = 1; i <= numOfMarkers; i++) {
      const afterIndex = currentCardIndex + i;
      if (afterIndex < restaurants.length) {
        coords = restaurants[afterIndex].key.latLngCoords;
        markers.push(
          <MarkerIcon lat={coords.lat} lng={coords.lng} id={afterIndex} />
        );
      }
      const beforeIndex = currentCardIndex - i;
      if (!(beforeIndex < 0)) {
        coords = restaurants[beforeIndex].key.latLngCoords;
        markers.push(
          <MarkerIcon lat={coords.lat} lng={coords.lng} id={beforeIndex} />
        );
      }
    }
    return markers;
  };

  /** Info Window with name and match appears when the mouse hovers
   * over the marker.
   */
  const onMouseEnterMarker = (props, marker) => {
    const markerName = 'marker' + marker.id;
    let showInfoWindowsChange = showInfoWindows;
    showInfoWindowsChange[markerName] = true;
    setShowInfoWindows(showInfoWindowsChange);
  };

  /** Info window with name and match disappears when the mouse
   * leaves the marker.
   */
  const onMouseLeaveMarker = (props, marker) => {
    const markerName = 'marker' + marker.id;
    let showInfoWindowsChange = showInfoWindows;
    showInfoWindowsChange[markerName] = false;
    setShowInfoWindows(showInfoWindowsChange);
  };

  const onMouseClickMarker = (props, marker) => {
    setCurrentCardIndex(marker.id);
    setMapCenter(restaurants[currentCardIndex].key.latLngCoords);
  };

  const mapStyle = { height: '100vh', width: '50%' };
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
      center={mapCenter}
      defaultZoom={10}
      style={mapStyle}
      onChildMouseEnter={onMouseEnterMarker}
      onChildMouseLeave={onMouseLeaveMarker}
      onChildClick={onMouseClickMarker}
      aria-label={'Google Map with top 4 restaurant markers.'}>
      {createMarkers()}
    </GoogleMapReact>
  );
}

export default MapContainer;
