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

function getRecommendation() {
  const cuisineType = document.getElementById('cuisine').value;
  const radius =
      milesToMeters(parseInt(document.getElementById('distance').value));
  const priceLevel = document.getElementById('price-level').value;
  const currLat = document.getElementById('latitude').value;
  const currLng = document.getElementById('longitude').value;
  const diningExp = document.getElementById('dining-experience').value;
  const apiKey = 'AIzaSyBBqtlu5Y3Og7lzC1WI9SFHZr2gJ4iDdTc';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const textSearchBaseUrl =
      'https://maps.googleapis.com/maps/api/place/textsearch/json?';
  const searchParams = new URLSearchParams();
  searchParams.append('query', cuisineType + ' restaurant');
  searchParams.append('location', currLat + ',' + currLng);
  searchParams.append('radius', radius);
  searchParams.append('key', apiKey);
  fetch(proxyUrl + textSearchBaseUrl + searchParams)
      // this will give us the list of restaurants
      .then((response) => response.json())
      .then((restaurants) => {
        fetch('/recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurants: restaurants.results,
            cuisineType: cuisineType,
            lat: currLat,
            lng: currLng,
            radius: radius,
            priceLevel: priceLevel,
            diningExp: diningExp,
          })
        })
            .then((response) => response.json())
            .then((selection) => {
              console.log(selection);
            });
      });
}

function milesToMeters(numMiles) {
  return numMiles * 1609.34;
}
