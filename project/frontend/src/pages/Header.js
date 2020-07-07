import './Header.css';

import React, { useState, useContext } from 'react';

import { AuthContext } from '../components/Authentication.js';
import Loading from '../components/Loading.js';
import UserModal from '../components/UserModal.js';

function Header(props) {
  const context = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          onClick={() => setIsModalOpen((prev) => !prev)}
        />
        <UserModal
          isModalOpen={isModalOpen}
          toggleModal={() => setIsModalOpen((prev) => !prev)}
          user={context.currentUser.get.getBasicProfile()}
          signOut={() => {
            setIsModalOpen(false);
            context.GoogleAuth.get.signOut();
          }}
        />
      </div>
    );
  }
  
  return (
    <div>
      <button className='sign-in' onClick={context.GoogleAuth.get.signIn}>
        Sign In with Google
      </button>
    </div>
  );
}

export default Header;
