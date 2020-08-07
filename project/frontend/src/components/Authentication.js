import React, { useState, useEffect, useContext } from 'react';

import FirestoreContext from '../contexts/FirestoreContext.js';

/**
 * A context containing the following fields:
 * - currentUser {!GoogleUser}
 * - signIn {function(): undefined}
 * - signOut {function(): undefined}
 *
 * Components that need authentication information may listen to this
 * context using the useContext(AuthContext) hook, AuthContext.Consumer
 * component, or the ClassWidget.contextType property.
 */
const AuthContext = React.createContext({});

/**
 * A high-order component responsible for initializing and maintaining authentication state
 * within the application. Serves the AuthContext to child components.
 */
function Authentication(props) {
  const { firestore } = useContext(FirestoreContext);

  const [GoogleAuth, setGoogleAuth] = useState({
    signIn: () => {},
    signOut: () => {},
  });
  const [currentUser, setCurrentUser] = useState({ get: null });

  useEffect(() => {
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.init({
        client_id: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
      });

      auth2.currentUser.listen((user) => {
        setCurrentUser({ get: user });
      });

      setGoogleAuth(auth2);
    });
  }, []);

  const signInWrapper = async () => {
    let user;
    try {
      user = await GoogleAuth.signIn();
    } catch (e) {
      // TODO: Add component to notify user of sign in failure
      return;
    }

    const id = user.getId();
    try {
      const ref = firestore.collection('users').doc(id);
      const doc = await ref.get();
      if (!doc.exists) {
        const profile = user.getBasicProfile();
        ref.set({
          id: profile.getId(),
          name: profile.getName(),
          givenName: profile.getGivenName(),
          familyName: profile.getFamilyName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl(),
          currentSwipeMatchSession: null,
          location: '',
          cuisines: [],
          distance: [],
          price: [],
          experience: [],
        });
      }
    } catch (e) {
      throw e;
    }
  };

  const context = {
    currentUser: currentUser,
    signIn: signInWrapper,
    signOut: GoogleAuth.signOut,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { Authentication as default, AuthContext };
