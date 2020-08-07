import React from 'react';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

function _initFirestore() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRESTORE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_I,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  firebase.initializeApp(firebaseConfig);

  return { firebase, firestore: firebase.firestore() };
}

const FirestoreContext = React.createContext(_initFirestore());

export default FirestoreContext;
