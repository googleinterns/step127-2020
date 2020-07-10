import './HomePage.css';

import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className='container u-full-width'>
      <div className='row'>
        <div id='welcome' className='column'>
          <h1 id='logo'>[LOGO]</h1>
          <h4>Discover your restaurant match</h4>
          <button>Location</button>
          <div>
            <button>Swipe Match</button>
            <Link to='/find-match'>
              <button>Find My Match</button>
            </Link>
          </div>
        </div>
      </div>
      <div className='row match u-pad32'>
        <h4 className='title'>What we do</h4>
        <h5 className='subtitle'>Welcome</h5>
      </div>
      <div className='row-flex match u-pad64 u-pad-no-top'>
        <div
          className='example'
          style={{ transform: 'translateX(48px)' }}></div>
        <div className='seven columns description match u-pad56'>
          <h4>Let us find your best restaurant match.</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div className='row swipe u-pad32'>
        <h4 className='title'>Swipe Match</h4>
        <h5 className='subtitle'>Idk yet</h5>
      </div>
      <div className='row-flex swipe u-pad64 u-pad-no-top'>
        <div className='seven columns description swipe u-pad56'>
          <h4>
            Find the restaurant all your friends or family agree on with Swipe
            Match.
          </h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div
          className='example'
          style={{ transform: 'translateX(-48px)' }}></div>
      </div>
      <div className='row-flex feedback u-pad48'>
        <h4>Have any feedback?</h4>
        <button>Let us know</button>
      </div>
    </div>
  );
}

export default HomePage;
