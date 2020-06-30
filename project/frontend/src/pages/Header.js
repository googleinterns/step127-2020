import './Header.css';

import React, { useState, useEffect } from 'react';

import Modal from '../components/Modal.js';
import Loading from '../components/Loading.js';

function Header(props) {
  let [GoogleAuth, setGoogleAuth] = useState(undefined);
  let [currentUser, setCurrentUser] = useState(undefined);
  let [signedIn, setSignedIn] = useState(false);
  let [isModalOpen, setIsModalOpen] = useState(false);

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
      <div id='header'>
        <Loading />
      </div>
    );
  } else if (currentUser.isSignedIn()) {
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
    
    const signOut = () => {
      setIsModalOpen(false);
      GoogleAuth.signOut();
    };

    const profile = currentUser.getBasicProfile();
    const name = profile.getName();
    const email = profile.getEmail();
    const imageUrl = profile.getImageUrl();
    
    return (
      <div id="header">
        <img className='profile-pic' src={imageUrl} alt="Profile." onClick={toggleModal} />
        <Modal open={isModalOpen} onDismiss={toggleModal} top='64px' right='16px'>
          <img className='profile-pic large' src={imageUrl} alt="Large profile."/>
          <h4 className="user-name">{name}</h4>
          <h5 className="user-email">{email}</h5>
          <button>Profile</button>
          <br />
          <button className="sign-out"onClick={signOut}>Sign Out</button>
        </Modal>
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
