import React from 'react';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

function _initFirestore() {
  const firebaseConfig = {
    apiKey: 'AIzaSyC0Q4CyO-BM4M5jPvL3ayJ09RfymZYQjhs',
    authDomain: 'mak-step-2020.firebaseapp.com',
    databaseURL: 'https://mak-step-2020.firebaseio.com',
    projectId: 'mak-step-2020',
    storageBucket: 'mak-step-2020.appspot.com',
    messagingSenderId: '21423804760',
    appId: '1:21423804760:web:4fd3b3fdef792c51b3552d',
  };

  firebase.initializeApp(firebaseConfig);

  return { firebase, firestore: firebase.firestore() };
}

const FirestoreContext = React.createContext(_initFirestore());

export default FirestoreContext;
