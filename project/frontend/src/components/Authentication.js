import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({});

function Authentication(props) {
  const [GoogleAuth, setGoogleAuth] = useState({
    signIn: () => {},
    signOut: () => {},
  });
  const [currentUser, setCurrentUser] = useState({ get: undefined });

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
