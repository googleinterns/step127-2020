import './UserModal.css';

import React from 'react';

import Modal from '../components/Modal.js';

function UserModal(props) {
  const { isModalOpen, toggleModal, user, signOut } = props;

  return (
    <Modal open={isModalOpen} onDismiss={toggleModal} top='64px' right='16px'>
      <img
        className='profile-pic large'
        src={user.getImageUrl()}
        alt='Large profile.'
      />
      <h4 className='user-name'>{user.getName()}</h4>
      <h5 className='user-email'>{user.getEmail()}</h5>
      <button>Profile</button>
      <br />
      <button className='sign-out' onClick={signOut}>
        Sign Out
      </button>
    </Modal>
  );
}

export default UserModal;
