import './css/normalize.css';
import './css/skeleton.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Authentication from './components/Authentication.js';
import Header from './pages/Header.js';
import HomePage from './pages/HomePage.js';
import Footer from './pages/Footer.js';

import RestaurantCard from './components/RestaurantCard.js';

import * as serviceWorker from './serviceWorker';

// TODO: remove
import { restaurant, details } from './components/SampleRestaurant.js';

ReactDOM.render(
  <React.StrictMode>
    <Authentication>
      <Router>
        <Switch>
          
          <Route path='/test'>
            <RestaurantCard restaurant={restaurant} details={details} />
          </Route>
          
          <Route path='/'>
            <Header />
            <HomePage />
            <Footer />
          </Route>
          
        </Switch>
      </Router>
    </Authentication>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
