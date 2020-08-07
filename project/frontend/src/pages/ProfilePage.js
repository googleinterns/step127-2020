import React, { useContext } from 'react';

import { AuthContext } from '../components/Authentication.js';
import Modal from '../components/Modal.js';
import ProfileForm from '../components/ProfileForm.js';

function ProfilePage(props) {
  const authContext = useContext(AuthContext);
  let user = authContext.currentUser.get;
  const signedIn = user && user.isSignedIn();
  return [
    <Modal
      key='not-signed-in-modal'
      open={signedIn}
      centerHorizontal={true}
      top='120px'>
      <div style={{ height: '200px', width: '300px' }}>
        <h4>Looks like you aren't logged in!</h4>
        <br />
        <h6>Log in here: </h6>
        <button
          onClick={(event) => {
            event.preventDefault();
            authContext.signIn();
          }}
          style={{ marginTop: '10px' }}>
          Sign in with Google
        </button>
      </div>
    </Modal>,
    <ProfileForm />,
  ];
}

export default ProfilePage;
