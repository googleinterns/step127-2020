import './SwipeMatchForm.css';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Animals from '../scripts/animals.js';
import { AuthContext } from './Authentication.js';
import FirestoreContext from '../contexts/FirestoreContext.js';
import SwipeMatchService from '../scripts/SwipeMatchFirestoreService.js';

import Place from '../assets/place.svg';
import Fingerprint from '../assets/fingerprint.svg';
import Username from '../assets/username.svg';

/**
 * A form used to gather pertinent information from a user for the 'Swipe Match'
 * service.
 *
 * @param {!Object<string, number>} currLocation The current latitude and longitude
 *     coordinates of the user.
 * @param {string} locationName The formatted address of the current user.
 */
function SwipeMatchForm(props) {
  const { currLocation, locationName } = props;

  const history = useHistory();
  const { firestore } = useContext(FirestoreContext); 
  const authContext = useContext(AuthContext);
  const signedIn =
    authContext.currentUser.get && authContext.currentUser.get.isSignedIn();

  const [username, setUsername] = useState('');
  const [groupId, setGroupId] = useState('');
  const [creatorCurrentSession, setCreatorCurrentSession] = useState(null);
  const [isGroupIdValid, setIsGroupIdValid] = useState(true);

  const anonUsername = useRef('Anonymous ' + Animals.random());

  useEffect(() => {
    const user = authContext.currentUser.get;
    if (user && user.isSignedIn()) {
      setUsername(user.getBasicProfile().getName());
      (async () => {
        const creatorCurrentSession =
              await SwipeMatchService.fetchCreatorCurrentSwipeMatchSession(firestore, user);
        setCreatorCurrentSession(creatorCurrentSession);
      })();
    } else {
      setUsername('');
      setCreatorCurrentSession(null);
    }
  }, [authContext, firestore]);

  const createSession = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/swipe-match',
      state: {
        currLocation,
        action: 'create',
        username: username ? username : anonUsername.current,
      },
    });
  };

  const deleteThenCreateSession = (event) => {
    event.preventDefault();
    (async () => {
      await SwipeMatchService.deleteSession(
        firestore,
        authContext.currentUser.get,
        creatorCurrentSession
      );
      createSession(event);
    })();
  };

  const joinSession = (event) => {
    event.preventDefault();

    (async () => {
      const response = await fetch('/api/swipe-match/validate-group-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'groupId=' + groupId,
      });

      const valid = (await response.json()).valid === 'true';

      if (valid) {
        history.push({
          pathname: '/swipe-match',
          state: {
            currLocation,
            action: 'join',
            username: username ? username : anonUsername.current,
            groupId,
          },
        });
      } else {
        setIsGroupIdValid(false);
      }
    })();
  };

  const signIn = (event) => {
    event.preventDefault();
    authContext.signIn();
  };

  return (
    <div className='swipe-match-form-container'>
      <form onSubmit={createSession}>
        <h4>Create a new session.</h4>
        <p>
          The restaurants presented in this Swipe Match session will be based on
          the location below. You may optionally provide futher filters for the
          restaurants to be shown by expanding the filter dropdown. Upon
          creation, you will be provided with a group ID which others may use to
          join your session. You must be signed in to create a Swipe Match
          session, though you may still use an anonymous username.
        </p>
        <div className='swipe-match-authentication-lock'>
          <div style={{ opacity: signedIn ? 1 : 0.25 }}>
            <table className='swipe-match-table'>
              <tbody>
                <tr>
                  <td>
                    <img src={Username} alt='Username icon' />
                  </td>
                  <td>
                    <label htmlFor='username'>Username</label>
                  </td>
                  <td>
                    <input
                      type='text'
                      name='username'
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder={anonUsername.current}
                      disabled={!signedIn}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <img src={Place} alt='Location icon' />
                  </td>
                  <td>
                    <label>Location</label>
                  </td>
                  <td>
                    <p>{locationName}</p>
                  </td>
                </tr>
              </tbody>
            </table>
            {creatorCurrentSession ? [
              <p>
                It seems you already have an existing session! You can either return
                to your existing session or delete the old session and create a new
                one with the buttons below.
              </p>,
              <div className='swipe-match-existing-session'>
                <button type='submit' disabled={!signedIn}>
                  Return
                </button>
                <button onClick={deleteThenCreateSession} disabled={!signedIn}>
                  Delete and Create
                </button>
              </div>
            ] : (
              <button type='submit' disabled={!signedIn}>
                Create
              </button>
            )}
          </div>
          <button
            onClick={signIn}
            style={{ display: signedIn ? 'none' : 'block' }}>
            Sign in with Google
          </button>
        </div>
      </form>
      <div className='preference-form-divider'>
        <div />
        <p>Or</p>
        <div />
      </div>
      <form onSubmit={joinSession}>
        <h4>Join an existing session.</h4>
        <p>
          Provide a group ID below to join an existing Swipe Match session. The
          creator of a session will have a group ID to share. You may optionally
          provide a username which will be visible to others in the session.
        </p>
        <table className='swipe-match-table'>
          <tbody>
            <tr>
              <td>
                <img src={Username} alt='Username icon' />
              </td>
              <td>
                <label htmlFor='username'>Username</label>
              </td>
              <td>
                <input
                  type='text'
                  name='username'
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={anonUsername.current}
                />
              </td>
            </tr>
            <tr>
              <td>
                <img src={Fingerprint} alt='Group ID icon' />
              </td>
              <td>
                <label htmlFor='groupId'>Group ID</label>
              </td>
              <td>
                <input
                  className={isGroupIdValid ? '' : 'swipe-match-invalid-input'}
                  type='text'
                  name='groupId'
                  value={groupId}
                  onChange={(event) => setGroupId(event.target.value)}
                  onFocus={() => setIsGroupIdValid(true)}
                  placeholder='Enter a group ID'
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type='submit'>Join</button>
      </form>
    </div>
  );
}

export default SwipeMatchForm;
