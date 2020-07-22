// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* exported getRecommendation */
function getRecommendation() {
  const cuisineTypes = [];
  cuisineTypes.push(document.getElementById('cuisine').value);
  const milesRadius = parseInt(document.getElementById('distance').value);
  const radius = milesToMeters(milesRadius);
  const priceLevel = parseInt(document.getElementById('price-level').value);
  const lat = parseFloat(document.getElementById('latitude').value);
  const lng = parseFloat(document.getElementById('longitude').value);
  const diningExp = document.getElementById('dining-experience').value;
  const priceLevelWeight = 2;
  const diningExpWeight = 4;
  const radiusWeight = 3;

  const promises = makePromisesArray(cuisineTypes, lat, lng, radius);

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
      fetch('/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurants,
          preferences: {
            currLocation: {
              lat,
              lng,
            },
            radius: {
              pref: radius,
              weight: radiusWeight,
            },
            priceLevel: {
              pref: priceLevel,
              weight: priceLevelWeight,
            },
            diningExp: {
              pref: diningExp,
              weight: diningExpWeight,
            },
          },
        }),
      })
        .then((response) => response.text())
        .then((data) => {
          try {
            const selections = JSON.parse(data);
            console.log(selections);
          } catch (err) {
            console.log(err);
          }
        });
    });
}

/**
 *  Returns an array of promises of calls to the Google Places API.
 *  One promise is created for every cuisine type.
 */
function makePromisesArray(cuisineTypes, lat, lng, radius) {
  const apiKey = 'AIzaSyBBqtlu5Y3Og7lzC1WI9SFHZr2gJ4iDdTc';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const textSearchBaseUrl =
    'https://maps.googleapis.com/maps/api/place/textsearch/json?';
  const promises = [];
  for (const cuisineType of cuisineTypes) {
    const searchParams = new URLSearchParams();
    searchParams.append('query', cuisineType + ' restaurant');
    searchParams.append('location', lat + ',' + lng);
    searchParams.append('radius', radius);
    searchParams.append('key', apiKey);
    promises.push(fetch(proxyUrl + textSearchBaseUrl + searchParams));
  }
  return promises;
}

function milesToMeters(numMiles) {
  return numMiles * 1609.34;
}
