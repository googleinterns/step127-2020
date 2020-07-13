import React from 'react';
import MapContainer from './components/ResultsMap.js';

class MatchResults extends React.Component {
  render() {
    const { data } = this.props.location;
    const resultsList = data;
    // `resultsList` is the sorted list of restaurants.
    // Each restaurant is an object with fields: hash, key, value
    // `key` has data about the restaurant (name, location, etc.).
    // `value` is the percent match for that restaurant.
    console.log(resultsList);
    return <MapContainer restaurant={resultsList} />;
  }
}
export default MatchResults;
