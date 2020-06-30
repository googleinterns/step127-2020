import './Header.css';

import React, { useState, useEffect } from 'react';

function Dropdown(props) {
  const dontDismiss = (event) => {
    event.stopPropagation();
  };

  const backdropStyle = {
    display: props.open ? 'block' : 'none',
  };

  const dropdownStyle = {
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
  };
  
  return (
    <div className="dropdown-backdrop" onClick={props.onDismiss} style={backdropStyle}>
      <div className="dropdown" onClick={dontDismiss} style={dropdownStyle}>
        {props.children}
      </div>
    </div>
  );
}

function Header(props) {
  let [GoogleAuth, setGoogleAuth] = useState(undefined);
  let [currentUser, setCurrentUser] = useState(undefined);
  let [signedIn, setSignedIn] = useState(false);
  let [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const onGoogleAuthLoaded = () => {
      window.gapi.load('auth2', () => {
        const auth2 = window.gapi.auth2.init({
          client_id: '21423804760-e3goj1cdhg49ojdf780mcq92qgshbr4v.apps.googleusercontent.com',
        });
        
        auth2.isSignedIn.listen((signedIn) => {
          setSignedIn(signedIn);
        });
        
        auth2.currentUser.listen((user) => {
          setCurrentUser(user);
        });
        
        setGoogleAuth(auth2);
      });
    };

    if (window.gapi) {
      onGoogleAuthLoaded();
      return () => {};
    } else {
      window.addEventListener('DOMContentLoaded', onGoogleAuthLoaded);
      return () => {
        window.removeEventListener('DOMContentLoaded', onGoogleAuthLoaded);
      };
    }
  }, []);
  
  if (currentUser === undefined) {
    return (
      <div id="header">
        <div id="loading-comments" className="loading-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  } else if (currentUser.isSignedIn()) {
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    
    const signOut = () => {
      setIsDropdownOpen(false);
      GoogleAuth.signOut();
    };

    const profile = currentUser.getBasicProfile();
    const name = profile.getName();
    const email = profile.getEmail();
    const imageUrl = profile.getImageUrl();
    
    return (
      <div id="header">
        <img className='profile-pic' src={imageUrl} alt="Profile." onClick={toggleDropdown} />
        <Dropdown open={isDropdownOpen} onDismiss={toggleDropdown} top='64px' right='16px'>
          <img className='profile-pic large' src={imageUrl} alt="Large profile."/>
          <h4 className="user-name">{name}</h4>
          <h5 className="user-email">{email}</h5>
          <button>Profile</button>
          <br />
          <button className="sign-out"onClick={signOut}>Sign Out</button>
        </Dropdown>
      </div>
    );
  } else {
    return (
      <div id="header">
        <button className="sign-in" onClick={GoogleAuth.signIn}>
          Sign In with Google
        </button>
      </div>
    );
  }
}

export default Header;
