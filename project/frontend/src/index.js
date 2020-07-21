import 'rsuite/dist/styles/rsuite-default.css';
import './css/normalize.css';
import './css/skeleton.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Authentication from './components/Authentication.js';
import Footer from './pages/Footer.js';
import Header from './pages/Header.js';
import HomePage from './pages/HomePage.js';
import MatchResultsPage from './pages/MatchResultsPage.js';

import RestaurantCard from './components/RestaurantCard.js';
import RestaurantCardDeck from './components/RestaurantCardDeck.js';
import RestaurantCardStack from './components/RestaurantCardStack.js';

import * as serviceWorker from './serviceWorker';

// TODO: remove
import generateRestaurant from './components/SampleRestaurant.js';
const numberOfCardsToGenerate = 20;
const restaurants = [];
for (let i = 0; i < numberOfCardsToGenerate; i++) {
  const restaurant = generateRestaurant('Olive Garden Italian Restaurant ' + i);
  restaurants.push(restaurant);
}

// TODO: Use Redirect component
ReactDOM.render(
  <React.StrictMode>
    <Authentication>
      <Router>
        <Header />
        <Switch>
          <Route path='/deck'>
            <div className='container'>
              <div className='row'>
                <div className='one-half column'>
                  <RestaurantCardDeck restaurants={restaurants} />
                </div>
                <div className='one-half column'>
                  <RestaurantCardStack restaurants={restaurants} />
                </div>
              </div>
            </div>
          </Route>

          <Route path='/card'>
            <RestaurantCard restaurant={generateRestaurant()} />
          </Route>

          <Route path='/match-results' component={MatchResultsPage} />
          <Route path='/' component={HomePage} />
        </Switch>
        <Footer />
      </Router>
    </Authentication>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
