import React, { Fragment, useState } from 'react';

import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const {
    restaurants,
    userLocation,
    currentCardIndex,
    setCurrentCardIndex,
  } = props;

  const center =
    restaurants.length === 0
      ? userLocation
      : restaurants[currentCardIndex].key.latLngCoords;

  const [showInfoWindows, setShowInfoWindows] = useState({});

  const YouAreHereIcon = (props) => {
    return (
      <div
        style={{
          height: '25px',
          width: '25px',
          backgroundColor: '#F8F8F8',
          borderRadius: '50%',
          position: 'relative',
        }}>
        <div
          style={{
            height: '15px',
            width: '15px',
            top: '5px',
            left: '5px',
            backgroundColor: '#007AFF',
            borderRadius: '50%',
            position: 'absolute',
          }}
        />
      </div>
    );
  };

  const MarkerIcon = (props) => {
    const markerID = props.id;
    const markerName = 'marker' + markerID;
    // TODO: Check the casing of the restaurant name (some come back all caps).
    const restaurantName = restaurants[markerID].key.name;
    const percentValue = Math.round(restaurants[markerID].value * 100);
    return (
      <Fragment>
        <img src={Lunch} alt={'lunch icon'} />
        {(markerID === currentCardIndex || showInfoWindows[markerName]) && (
          <InfoWindow
            restaurantName={restaurantName}
            percentMatch={percentValue + '%'}
            aria-label={restaurantName + ' Info Window'}
          />
        )}
      </Fragment>
    );
  };

  const InfoWindow = (props) => {
    const { restaurantName, percentMatch } = props;
    const infoWindowStyle = {
      position: 'relative',
      width: '344px',
      fontFamily: 'Montserrat',
      transform: 'translate(calc(-50% + 15px), calc(-100% - 38px))',
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      textAlign: 'left',
      padding: '16px',
      zIndex: '50',
      borderRadius: '4px',
    };

    return (
      <div className='restaurant-header' style={infoWindowStyle}>
        <h5 className={'restaurant-name'}>{restaurantName}</h5>
        <h5 className='restaurant-score'>{percentMatch}</h5>
      </div>
    );
  };

  /**
   * Creates all the markers that are going to be displayed
   * on the screen. It creates the marker corresponding
   * to the restaurant at currentCardIndex, the numAdjacentMarkers
   * markers before that and the numAdjacentMarkers markers
   * after that.
   */
  const createMarkers = () => {
    if (restaurants.length === 0) {
      return null;
    }
    const markers = [];
    const numAdjacentMarkers = 3;
    for (
      let delta = -numAdjacentMarkers;
      delta <= numAdjacentMarkers;
      delta++
    ) {
      const addMarkerIndex = currentCardIndex + delta;
      if (isValidIndex(addMarkerIndex)) {
        const coords = restaurants[addMarkerIndex].key.latLngCoords;
        markers.push(
          <MarkerIcon
            lat={coords.lat}
            lng={coords.lng}
            id={addMarkerIndex}
            aria-label={'Your #' + (addMarkerIndex + 1) + ' Match'}
          />
        );
      }
    }
    return markers;
  };

  /**
   * Checks that the current index is a valid index for
   * the restaurant matches list.
   */
  const isValidIndex = (index) => index >= 0 && index < restaurants.length;

  /**
   * Info Window with name and match appears when the mouse hovers
   * over the marker.
   */
  const onMouseEnterMarker = (props, marker) => {
    const markerName = 'marker' + marker.id;
    let showInfoWindowsChange = showInfoWindows;
    showInfoWindowsChange[markerName] = true;
    setShowInfoWindows(showInfoWindowsChange);
  };

  /**
   * Info window with name and match disappears when the mouse
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
  };

  const mapStyle = { height: 'inherit', width: '50%', position: 'relative' };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
      center={center}
      defaultZoom={14}
      style={mapStyle}
      onChildMouseEnter={onMouseEnterMarker}
      onChildMouseLeave={onMouseLeaveMarker}
      onChildClick={onMouseClickMarker}
      aria-label={'Google Map with restaurant markers.'}>
      {createMarkers()}
      <YouAreHereIcon
        lat={userLocation.lat}
        lng={userLocation.lng}
        aria-label={'Your current location!'}
      />
    </GoogleMapReact>
  );
}

export default MapContainer;
