import './Header.css';

import React, { useState, useContext } from 'react';

import { AuthContext } from '../components/Authentication.js';
import Modal from '../components/Modal.js';
import Loading from '../components/Loading.js';

function UserModal(props) {
  return (
    <Modal
      open={props.isModalOpen}
      onDismiss={props.toggleModal}
      top='64px'
      right='16px'>
      <img
        className='profile-pic large'
        src={props.user.getImageUrl()}
        alt='Large profile.'/>
      <h4 className='user-name'>{props.user.getName()}</h4>
      <h5 className='user-email'>{props.user.getEmail()}</h5>
      <button>Profile</button>
      <br />
      <button className='sign-out' onClick={props.signOut}>Sign Out</button>
    </Modal>
  );
}

function Header(props) {
  const context = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let headerContent;
  if (context.currentUser.get === undefined) {
    headerContent = <Loading />;
  } else if (context.currentUser.get.isSignedIn()) {
    const toggleModal = () => {
      setIsModalOpen((prev) => !prev);
    };
    
    const signOut = () => {
      setIsModalOpen(false);
      context.GoogleAuth.get.signOut();
    };
    
    headerContent = ([
      <img
        key='profile-pic'
        className='profile-pic'
        src={context.currentUser.get.getBasicProfile().getImageUrl()}
        alt='Profile.'
        onClick={toggleModal}/>,
      <UserModal
        key='user-modal'
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        signOut={signOut}
        user={context.currentUser.get.getBasicProfile()}/>
    ]);
  } else {
    headerContent = (
      <button className='sign-in' onClick={context.GoogleAuth.get.signIn}>
        Sign In with Google
      </button>
    );
  }
  
  return (
    <div id='header'>
      {headerContent}
    </div>
  );
}

export default Header;
