import './UserModal.css';

import React from 'react';

import Modal from '../components/Modal.js';

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
        alt='Large profile.'
      />
      <h4 className='user-name'>{props.user.getName()}</h4>
      <h5 className='user-email'>{props.user.getEmail()}</h5>
      <button>Profile</button>
      <br />
      <button className='sign-out' onClick={props.signOut}>
        Sign Out
      </button>
    </Modal>
  );
}

export default UserModal;
