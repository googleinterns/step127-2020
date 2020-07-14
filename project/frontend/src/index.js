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
<<<<<<< HEAD
import MatchResults from './pages/MatchResults.js';
import PreferenceForm from './components/PreferenceForm.js';
=======
import MapContainer from './components/ResultsMap.js';
import MatchResultsPage from './pages/MatchResultsPage.js';

import RestaurantCard from './components/RestaurantCard.js';
>>>>>>> e65ad37471da0e73acbe5a9da396324d50329ce5

import * as serviceWorker from './serviceWorker';

// TODO: remove
import { restaurant, details } from './components/SampleRestaurant.js';

// TODO: Use Redirect component
ReactDOM.render(
  <React.StrictMode>
    <Authentication>
      <Router>
        <Header />
        <Switch>
<<<<<<< HEAD
          <Route exact path='/' component={HomePage} />
          <Route path='/find-match' component={PreferenceForm} />
          <Route path='/match-results' component={MatchResults} />
=======
          <Route path='/card'>
            <RestaurantCard restaurant={restaurant} details={details} />
          </Route>

          <Route path='/match-results' component={MatchResultsPage} />
          <Route path='/mapRoute' component={MapContainer} />
          <Route path='/' component={HomePage} />
>>>>>>> e65ad37471da0e73acbe5a9da396324d50329ce5
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
