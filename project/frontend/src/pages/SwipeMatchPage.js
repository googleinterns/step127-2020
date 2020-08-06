import React, { useState, useEffect, useContext, useReducer } from 'react';

import { AuthContext } from '../components/Authentication.js';
import FirestoreContext from '../contexts/FirestoreContext.js';
import PlacesApiContext from '../contexts/PlacesApiContext.js';

import Modal from '../components/Modal.js';
import RestaurantCardDeck from '../components/RestaurantCardDeck.js';
import SwipeMatchConsole from '../components/SwipeMatchConsole.js';
import SwipeMatchLeaderboard from '../components/SwipeMatchLeaderboard.js';

import SwipeMatchService from '../scripts/SwipeMatchFirestoreService.js';

function reducer(previous, action) {
  let { location, restaurants, sessionStarted, users } = previous;
  const { payload, type } = action;

  if (type === 'set restaurants') {
    restaurants = payload;
  } else if (type === 'snapshot') {
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

    restaurants = restaurants.map((restaurant) => {
      const likes = payload.likes[restaurant.key.id];
      if (likes) {
        restaurant.fractionLiked = likes.length / users.length;
      }
      return restaurant;
    });
  }

  return { location, restaurants, sessionStarted, users };
}

function SwipeMatchPage(props) {
  const { currLocation, action, username } = props.location.state;
  const isCreator = action === 'create';

  const authContext = useContext(AuthContext);
  const { firebase, firestore } = useContext(FirestoreContext);
  const placesService = useContext(PlacesApiContext);

  const [groupId, setGroupId] = useState(props.location.state.groupId || '');
  const [
    { location, restaurants, sessionStarted, users },
    dispatch,
  ] = useReducer(reducer, {
    location: { lat: undefined, lng: undefined },
    restaurants: [],
    sessionStarted: false,
    users: [],
  });

  useEffect(
    () => {
      let unsubscribe;
      let id = groupId;

      (async () => {
        if (isCreator) {
          let user = authContext.currentUser.get;

          if (user && user.isSignedIn()) {
            let creatorCurrentSwipeMatchSession = null;
            try {
              creatorCurrentSwipeMatchSession = await SwipeMatchService.fetchCreatorCurrentSwipeMatchSession(
                firestore,
                user
              );
            } catch (e) {}

            if (creatorCurrentSwipeMatchSession) {
              id = creatorCurrentSwipeMatchSession;
            } else {
              try {
                id = await SwipeMatchService.createSession(
                  firestore,
                  currLocation
                );
                SwipeMatchService.updateCreatorCurrentSwipeMatchSession(
                  firestore,
                  user,
                  id
                );
              } catch (e) {
                setGroupId(null);
              }
            }
            setGroupId(id);
          }
        }

        if (id) {
          unsubscribe = SwipeMatchService.addSessionListener(
            firestore,
            id,
            (doc) => dispatch({ type: 'snapshot', payload: doc.data() }),
            (error) => console.log('ERROR: ' + error)
          );
          SwipeMatchService.addUser(firebase, firestore, id, username);
        }
      })();

      return () => {
        if (unsubscribe !== undefined) {
          unsubscribe();
        }
        if (id) {
          SwipeMatchService.removeUser(firebase, firestore, id, username);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    isCreator ? [authContext] : []
  );

  useEffect(() => {
    if (location.lat && location.lng) {
      console.log('ACTUALLY UPDATING RESTAURANTS');
      SwipeMatchService.fetchRestaurants(placesService, location, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const startSession = () => {
    SwipeMatchService.startSession(firestore, groupId);
  };

  const onDeckSwipe = (restaurantId, action) => {
    SwipeMatchService.swipeRestaurant(
      firebase,
      firestore,
      groupId,
      restaurantId,
      action
    );
  };

  return [
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
      />
    </Modal>,
  ];
}

export default SwipeMatchPage;
