import './Header.css';

import React, { useState, useContext } from 'react';

import { AuthContext } from '../components/Authentication.js';
import Loading from '../components/Loading.js';
import UserModal from '../components/UserModal.js';

function Header(props) {
  const authContext = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!authContext.currentUser.get) {
    return (
      <div id='header'>
        <Loading />
      </div>
    );
  }

  if (authContext.currentUser.get.isSignedIn()) {
    return (
      <div id='header'>
        <img
          className='profile-pic'
          src={authContext.currentUser.get.getBasicProfile().getImageUrl()}
          alt='Profile.'
          onClick={() => setIsModalOpen((prev) => !prev)}
        />
        <UserModal
          open={isModalOpen}
          onDismiss={() => setIsModalOpen((prev) => !prev)}
          user={authContext.currentUser.get.getBasicProfile()}
          signOut={() => {
            setIsModalOpen(false);
            authContext.signOut();
          }}
        />
      </div>
    );
  }

  return (
    <div id='header'>
      <button className='sign-in' onClick={authContext.signIn}>
        Sign In with Google
      </button>
    </div>
  );
}

export default Header;
