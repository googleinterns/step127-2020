import React from 'react';

const PlacesApiContext = React.createContext(
  new window.google.maps.places.PlacesService(
    document.getElementById('attributions')
  )
);

export default PlacesApiContext;
