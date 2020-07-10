import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React, { useState } from 'react';

const mapStyle = {
  border: 'thin solid black',
  height: '500px',
  width: '500px',
};

function MapContainer(props) {
  // Declare all the states for this functional component
  const [activeMarker, changeMarker] = useState({});
  const [showInfoWindow, changeInfoVisibility] = useState(false);
  const coords = { lat: 40.837, lng: -73.865 };
  return (
    <Map
      aria-label={'A Google Map with your Matches!'}
      google={props.google}
      zoom={14}
      style={mapStyle}
      center={coords}>
      <Marker
        onClick={onMarkerClick}
        name={'Your #1 Match'}
        aria-label={'Your #1 Match'}
      />
      <InfoWindow
        marker={activeMarker}
        visible={showInfoWindow}
        onClose={onClose}>
        <div>
          <h5>{'This is your place'}</h5>
        </div>
      </InfoWindow>
    </Map>
  );
}

function onMarkerClick(props, marker, event) {
  changeMarker(marker);
  changeInfoVisibility(true);
}

function onClose(props) {
  if (showInfoWindow) {
    changeInfoVisibility(false);
    changeMarker(null);
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(MapContainer);

// export class MapContainer extends React.Component {
//   constructor(props) {
//     super(props);
//     // TODO: change this to be the first match coordinates
//     this.state = {
//       lat: 40.837,
//       lng: -73.865,
//       selectedPlace: {},
//       activeMarker: {},
//       showingInfoWindow: false,
//     };
//   }

//   onClose = (props) => {
//     if (this.state.showingInfoWindow) {
//       this.setState({
//         showingInfoWindow: false,
//         activeMarker: null,
//       });
//     }
//   };

//   render() {
//     const { lat, lng } = this.state;
//     return (
//       <Map
//         google={this.props.google}
//         zoom={14}
//         style={mapStyle}
//         center={(lat, lng)}>
//         <Marker onClick={this.onMarkerClick} name={'Your #1 Match'} />
//         <InfoWindow
//           marker={this.state.activeMarker}
//           visible={this.state.showingInfoWindow}
//           onClose={this.onClose}>
//           <div>
//             <h5>{this.state.selectedPlace.name}</h5>
//           </div>
//         </InfoWindow>
//       </Map>
//     );
//   }
// }
