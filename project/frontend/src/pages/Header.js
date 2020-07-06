import './Header.css';

import React from 'react';

function Header(props) {
  return (
    <div id='header'>
      {props.isUserLoggedIn ? (
        <div>Pic</div>
      ) : (
        [
          <button key='1' className='header-button'>
            Create Account
          </button>,
          <button key='2' className='header-button'>
            Log in
          </button>,
        ]
      )}
    </div>
  );
}

export default Header;
