import React from 'react';
import ReactDOM from 'react-dom';

import Header from '/header/Header.js';
import HomePage from './home/HomePage.js';
import Footer from '/footer/Footer.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
    <Header />
    <HomePage />
    <Footer />
  </React.StrictMode>,
  document.querySelector('body')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
