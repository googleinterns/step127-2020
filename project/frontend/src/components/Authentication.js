import React, { useState, useEffect } from 'react';

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
  const [GoogleAuth, setGoogleAuth] = useState({
    signIn: () => {},
    signOut: () => {},
  });
  const [currentUser, setCurrentUser] = useState({ get: null });

  useEffect(() => {
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.init({
        client_id:
          '21423804760-e3goj1cdhg49ojdf780mcq92qgshbr4v.apps.googleusercontent.com',
      });

      auth2.currentUser.listen((user) => {
        setCurrentUser({ get: user });
      });

      setGoogleAuth(auth2);
    });
  }, []);

  const context = {
    currentUser: currentUser,
    signIn: GoogleAuth.signIn,
    signOut: GoogleAuth.signOut,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { Authentication as default, AuthContext };
