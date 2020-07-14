export default function getRecommendation(preferences, callback) {
  const promises = makePromisesArray(preferences);

  Promise.all(promises)
    // This gives us the list of restaurants.
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => {
      let restaurants = [];
      for (const restaurant of data) {
        restaurants = restaurants.concat(restaurant.results);
      }

      if (restaurants.length === 0) {
        if (preferences.radius.pref) {
          preferences.radius.pref = '';
          getRecommendation(preferences, callback);
        } else {
          let message = "We can't find any restaurants near you";
          if (preferences.open) {
            message += ' that are currently open';
          }
          message +=
            ' that match your preferences. Please try changing your preferences.';
          // TODO: create NoResults page that would be rendered here.
          alert(message);
        }
        return;
      }

      fetch('/api/recommendation', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurants,
          preferences,
        }),
      })
        .then((response) => response.text())
        .then((data) => {
          try {
            const selections = JSON.parse(data);
            return callback(selections);
          } catch (err) {
            console.log(err);
          }
        });
    });
}

/**
 *  Returns an array of promises of calls to the Google Places API.
 *  One promise is created for every cuisine type.
 *  If no cuisines are specified, only one promise is created.
 */
function makePromisesArray(preferences) {
  const { cuisine, radius, currLocation, diningExp, open } = preferences;
  // If the user specified delivery the default to 15 mile radius.
  // Else default to max radius allowed by the API.
  const defaultRadius =
    diningExp === 'meal_delivery' ? milesToMeters(15) : 50000;
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const nearbySearchBaseUrl =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
  const promises = [];
  const cuisineTypes = cuisine;
  // Make sure we still create a promise even if no cuisine type is specified.
  // This will make the text search query just "restaurant" without specifying a cuisine.
  if (cuisineTypes.length === 0) {
    cuisineTypes.push('');
  }
  for (const cuisineType of cuisineTypes) {
    const searchParams = new URLSearchParams();
    searchParams.append('type', 'restaurant');
    searchParams.append('location', currLocation.lat + ',' + currLocation.lng);
    if (cuisineType) {
      searchParams.append('keyword', cuisineType);
    }
    if (radius.pref) {
      searchParams.append('radius', milesToMeters(radius.pref));
    } else {
      searchParams.append('radius', defaultRadius);
    }
    if (open) {
      searchParams.append('opennow', open);
    }
    searchParams.append('key', process.env.REACT_APP_GOOGLE_API_KEY);
    promises.push(fetch(proxyUrl + nearbySearchBaseUrl + searchParams));
  }
  return promises;
}

function milesToMeters(numMiles) {
  return numMiles * 1609.34;
}
