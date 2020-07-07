import './UserModal.css';

import React from 'react';

import Modal from '../components/Modal.js';

/**
 * A Modal implementation which displays the specified user information.
 *
 * @param {bool} props.open True if the modal should be shown; false if it
 *     should be hidden.
 * @param {function(): undefined} props.onDismiss Callback for when modal
 *     is dismissed by touching modal backdrop, should update props.open
 *     to false.
 * @param {!gapi.auth2.BasicProfile} user The basic profile of the user
 *     whose information should be displayed.
 * @param {function(): undefined} signOut A callback for when the sign out
 *     button is pressed.
 */
function UserModal(props) {
  const { open, onDismiss, user, signOut } = props;

  return (
    <Modal open={open} onDismiss={onDismiss} top='64px' right='16px'>
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
