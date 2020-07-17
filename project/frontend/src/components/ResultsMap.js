import React from 'react';
import GoogleMapReact from 'google-map-react';
import Lunch from '../assets/lunch.svg';

function MapContainer(props) {
  const restaurants = props.restaurants;
  const userCenter = props.userLocation;

  const MarkerIcon = () => <img src={Lunch} alt='Lunch icon' />;

  const InfoWindow = (props) => {
    // const { place } = {
    //   name: 'yah',
    //   rating: 2.5,
    //   opening_hours: { open_now: true },
    //   types: ['Italian'],
    // };
    const infoWindowStyle = {
      position: 'relative',
      bottom: 150,
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
        <div style={{ fontSize: 16 }}>{'Applebees'}</div>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: 'grey' }}>{2.5} </span>
          <span style={{ color: 'orange' }}>
            {String.fromCharCode(9733).repeat(Math.floor(2.5))}
          </span>
          <span style={{ color: 'lightgrey' }}>
            {String.fromCharCode(9733).repeat(5 - Math.floor(2.6))}
          </span>
        </div>
        <div style={{ fontSize: 14, color: 'grey' }}>{'American'}</div>
        <div style={{ fontSize: 14, color: 'grey' }}>{'$'.repeat(3)}</div>
        <div style={{ fontSize: 14, color: 'green' }}>
          {true ? 'Open' : 'Closed'}
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
      <InfoWindow />
    </GoogleMapReact>
  );
}

export default MapContainer;
