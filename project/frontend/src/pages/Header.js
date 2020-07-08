import './Header.css';

import React, { useState, useContext } from 'react';

import { AuthContext } from '../components/Authentication.js';
import Loading from '../components/Loading.js';
import UserModal from '../components/UserModal.js';

/**
 * The persistent header of this application. Displays a sign in button
 * or user profile picture based on authentication status.
 */
function Header(props) {
  const authContext = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = authContext.currentUser.get;

  if (!user) {
    return (
      <div id='header'>
        <Loading />
      </div>
    );
  }

  if (user.isSignedIn()) {
    return (
      <div id='header'>
        <img
          className='profile-pic'
          src={user.getBasicProfile().getImageUrl()}
          alt='Profile.'
          onClick={() => setIsModalOpen((prev) => !prev)}
        />
        <UserModal
          open={isModalOpen}
          onDismiss={() => setIsModalOpen((prev) => !prev)}
          user={user.getBasicProfile()}
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
