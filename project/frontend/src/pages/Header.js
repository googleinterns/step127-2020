import './Header.css';

import React, { useState, useContext } from 'react';

import { useHistory } from 'react-router';

import { AuthContext } from '../components/Authentication.js';
import Loading from '../components/Loading.js';
import UserModal from '../components/UserModal.js';

/**
 * The persistent header of this application. Displays a sign in button
 * or user profile picture based on authentication status.
 */
function Header(props) {
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const goHome = () => {
    history.push('/');
  };

  const logo = (
    <h5 className='header-logo' onClick={goHome}>
      MAKMatch
    </h5>
  );

  const user = authContext.currentUser.get;
  if (!user) {
    return (
      <div id='header'>
        {logo}
        <Loading style={{ marginRight: '16px' }} />
      </div>
    );
  }

  if (user.isSignedIn()) {
    return (
      <div id='header'>
        {logo}
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
      {logo}
      <button className='sign-in' onClick={authContext.signIn}>
        Sign In with Google
      </button>
    </div>
  );
}

export default Header;
