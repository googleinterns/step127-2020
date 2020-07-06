import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({});

function Authentication(props) {
  const [GoogleAuth, setGoogleAuth] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [signedIn, setSignedIn] = useState(false);

  const context = {
    GoogleAuth: { get: GoogleAuth, set: setGoogleAuth },
    currentUser: { get: currentUser, set: setCurrentUser },
    signedIn: { get: signedIn, set: setSignedIn },
  };

  useEffect(() => {
    const onGoogleAuthLoaded = () => {
      window.gapi.load('auth2', () => {
        const auth2 = window.gapi.auth2.init({
          client_id:
            '21423804760-e3goj1cdhg49ojdf780mcq92qgshbr4v.apps.googleusercontent.com',
        });

        auth2.isSignedIn.listen((signedIn) => {
          setSignedIn(signedIn);
        });

        auth2.currentUser.listen((user) => {
          setCurrentUser(user);
        });

        setGoogleAuth(auth2);
      });
    };

    if (window.gapi) {
      onGoogleAuthLoaded();
      return () => {};
    } else {
      window.addEventListener('DOMContentLoaded', onGoogleAuthLoaded);
      return () => {
        window.removeEventListener('DOMContentLoaded', onGoogleAuthLoaded);
      };
    }
  }, []);

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { Authentication as default, AuthContext };
