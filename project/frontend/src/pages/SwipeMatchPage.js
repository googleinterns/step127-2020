import React, { useState, useEffect, useContext, useReducer } from 'react';

import { useHistory } from 'react-router-dom';

import { AuthContext } from '../components/Authentication.js';
import FirestoreContext from '../contexts/FirestoreContext.js';
import PlacesApiContext from '../contexts/PlacesApiContext.js';

import Modal from '../components/Modal.js';
import RestaurantCardDeck from '../components/RestaurantCardDeck.js';
import SwipeMatchConsole from '../components/SwipeMatchConsole.js';
import SwipeMatchHeader from '../components/SwipeMatchHeader.js';
import SwipeMatchLeaderboard from '../components/SwipeMatchLeaderboard.js';
import SwipeMatchSummary from '../components/SwipeMatchSummary.js';

import SwipeMatchService from '../scripts/SwipeMatchFirestoreService.js';

/**
 * A reducer for the SwipeMatchPage component.
 *
 * @param {!Object<string, *>} previous The previous state of the SwipeMatchPage
 *     component.
 * @param {!Object<string, *>} action The data used to update the component's state,
 *     including a type and payload.
 */
function reducer(previous, action) {
  let {
    likes,
    location,
    restaurants,
    sessionStarted,
    sessionEnded,
    users,
  } = previous;
  const { payload, type } = action;

  if (type === 'set restaurants') {
    restaurants = payload;
  } else if (type === 'snapshot') {
    if (payload) {
      if (
        location.lat !== payload.location.lat ||
        location.lng !== payload.location.lng
      ) {
        location = payload.location;
      }

      if (sessionStarted !== payload.sessionStarted) {
        sessionStarted = payload.sessionStarted;
      }

      if (users.toString() !== payload.users.toString()) {
        users = payload.users;
      }

      if (JSON.stringify(likes) !== JSON.stringify(payload.likes)) {
        likes = payload.likes;
      }
    } else {
      sessionEnded = true;
    }
  }

  restaurants = restaurants.map((restaurant) => {
    const usersLiked = likes[restaurant.key.id];
    if (usersLiked) {
      restaurant.fractionLiked = usersLiked.length / users.length;
    }
    return restaurant;
  });

  return { likes, location, restaurants, sessionStarted, sessionEnded, users };
}

/**
 * The landing page for the "Swipe Match" service.
 *
 * @param {string} props.username The username of the current user.e
 * @param {string} props.groupId The group id of this swipe match session.
 * @param {boolean} props.isCreator True if the current user is the creator of this
 *     session; false otherwise.
 */
function SwipeMatchPage(props) {
  const { username, groupId, isCreator } = props.location.state;

  const authContext = useContext(AuthContext);
  const { firebase, firestore } = useContext(FirestoreContext);
  const placesService = useContext(PlacesApiContext);

  const history = useHistory();

  const [
    { likes, location, restaurants, sessionStarted, sessionEnded, users },
    dispatch,
  ] = useReducer(reducer, {
    likes: {},
    location: { lat: undefined, lng: undefined },
    restaurants: [],
    sessionStarted: false,
    sessionEnded: false,
    users: [username],
  });

  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    let unsubscribe = SwipeMatchService.addSessionListener(
      firestore,
      groupId,
      (doc) => dispatch({ type: 'snapshot', payload: doc.data() }),
      (error) => console.log('ERROR: ' + error)
    );
    SwipeMatchService.addUser(firebase, firestore, groupId, username);

    const beforeUnload = (event) => {
      (async () => {
        const data = await SwipeMatchService.retrieveSession(
          firestore,
          groupId
        );
        window.swipeMatchSession = data;
      })();

      // The following three lines each ensure a confirmation dialog will appear
      // for different user agents.
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    const unload = (fromWindow) => {
      SwipeMatchService.removeUser(
        firebase,
        firestore,
        groupId,
        username,
        fromWindow
      );
      unsubscribe();
    };

    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('unload', () => unload(/* fromWindow= */ true));

    setUnsubscribe(() => unsubscribe);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      unload(/* fromWindow= */ false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      SwipeMatchService.fetchRestaurants(placesService, location, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const user = authContext.currentUser.get;
    if (restaurants.length !== 0 && !(user && user.isSignedIn())) {
      leaveSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext]);

  useEffect(() => {
    if (restaurants.length !== 0 && !users.includes(username)) {
      leaveSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const startSession = () => {
    SwipeMatchService.startSession(firestore, groupId);
  };

  const endSession = () => {
    SwipeMatchService.deleteSession(
      firestore,
      authContext.currentUser.get,
      groupId
    );
  };

  const leaveSession = () => {
    unsubscribe();
    SwipeMatchService.removeUser(
      firebase,
      firestore,
      groupId,
      username,
      /* fromWindow= */ false
    );
    history.replace('/');
  };

  const onDeckSwipe = (restaurantId, action) => {
    SwipeMatchService.swipeRestaurant(
      firebase,
      firestore,
      groupId,
      restaurantId,
      username,
      action
    );
  };

  const kickUser = (user) => {
    SwipeMatchService.removeUser(
      firebase,
      firestore,
      groupId,
      user,
      /* fromWindow= */ false
    );
  };

  return [
    <SwipeMatchHeader
      key='swipe-match-header'
      visible={sessionStarted}
      groupId={groupId}
      username={username}
      users={users}
      isCreator={isCreator}
      endSession={endSession}
      leaveSession={leaveSession}
    />,
    <div key='swipe-match-page' className='container u-full-width'>
      <div
        className='row'
        style={{
          opacity: sessionStarted ? 1 : 0,
          transition: 'opacity 0.5s cubic-bezier(0.35, 0.91, 0.33, 0.97)',
          backgroundColor: '#f3f3f3',
        }}>
        <div
          className='one-half column u-pad32'
          style={{ backgroundColor: 'white' }}>
          <h4>Nearby Restaurants</h4>
          <RestaurantCardDeck restaurants={restaurants} onSwipe={onDeckSwipe} />
        </div>
        <div className='one-half column u-pad32'>
          <h4>Rankings</h4>
          <SwipeMatchLeaderboard restaurants={restaurants} />
        </div>
      </div>
    </div>,
    <Modal key='swipe-match-console' open={!sessionStarted} center={true}>
      <SwipeMatchConsole
        username={username}
        groupId={groupId}
        users={users}
        isCreator={isCreator}
        startSession={startSession}
        kickUser={kickUser}
      />
    </Modal>,
    <Modal
      key='swipe-match-summary'
      open={sessionEnded}
      centerHorizontal={true}
      top='64px'
      bottom='64px'>
      <SwipeMatchSummary
        restaurants={[...restaurants].sort(
          (r1, r2) => r2.fractionLiked - r1.fractionLiked
        )}
        users={users}
        likes={likes}
      />
    </Modal>,
  ];
}

export default SwipeMatchPage;
