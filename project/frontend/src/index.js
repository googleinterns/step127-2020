import './css/normalize.css';
import './css/skeleton.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Authentication from './components/Authentication.js';
import Header from './pages/Header.js';
import HomePage from './pages/HomePage.js';
import Footer from './pages/Footer.js';
import PreferenceForm from './FindMatch/FindMatch.js';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Authentication>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/find-match' component={PreferenceForm} />
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
