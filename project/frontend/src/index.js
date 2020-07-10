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
import RestaurantCardDeck from './components/RestaurantCardDeck.js';
import RestaurantCardStack from './components/RestaurantCardStack.js';

import * as serviceWorker from './serviceWorker';

// TODO: remove
import generateRestaurant from './components/SampleRestaurant.js';
const cards = [];
for (let i = 0; i < 20; i++) {
  cards.push(generateRestaurant('Amarena ' + i, 'apr75h4bni2pf98h4inujnksjrliu34' + i));
}

ReactDOM.render(
  <React.StrictMode>
    <Authentication>
      <Router>
        <Switch>
          <Route path='/deck'>
            <div className='container'>
              <div className='row'>
                <div className='one-half column'>
                  <RestaurantCardDeck cards={cards} />
                </div>
                <div className='one-half column'>
                  <RestaurantCardStack cards={cards} />
                </div>
              </div>
            </div>
          </Route>
          
          <Route path='/card'>
            <RestaurantCard {...generateRestaurant()} />
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
