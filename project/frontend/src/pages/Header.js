import './Header.css';

import React, { useState, useContext } from 'react';

import { AuthContext } from '../components/Authentication.js';
import Loading from '../components/Loading.js';
import UserModal from '../components/UserModal.js';

function Header(props) {
  const context = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const signOut = () => {
    setIsModalOpen(false);
    context.GoogleAuth.get.signOut();
  };

  if (context.currentUser.get === undefined) {
    return <div id='header'><Loading /></div>;
  }

  if (context.currentUser.get.isSignedIn()) {
    return (
      <div id='header'>
        <img
          className='profile-pic'
          src={context.currentUser.get.getBasicProfile().getImageUrl()}
          alt='Profile.'
          onClick={toggleModal}
        />
        <UserModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          signOut={signOut}
          user={context.currentUser.get.getBasicProfile()}
        />
      </div>
    );
  } else {
    return (
      <div>
        <button className='sign-in' onClick={context.GoogleAuth.get.signIn}>
          Sign In with Google
        </button>
      </div>
    );
  }
}

export default Header;
