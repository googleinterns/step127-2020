import './SwipeMatchForm.css';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Animals from '../scripts/animals.js';
import { AuthContext } from './Authentication.js';

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
  const authContext = useContext(AuthContext);

  const [username, setUsername] = useState('wack');
  const [groupId, setGroupId] = useState('');

  const anonUsername = useRef('Anonymous ' + Animals.random());

  useEffect(() => {
    const user = authContext.currentUser.get;
    if (user && user.isSignedIn()) {
      setUsername(user.getBasicProfile().getName());
    } else {
      setUsername('');
    }
  }, [authContext]);

  const createSession = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/swipe-match',
      state: {
        currLocation,
        action: 'create',
        username: username ? username : anonUsername,
      },
    });
  };

  const joinSession = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/swipe-match',
      state: {
        currLocation,
        action: 'join',
        username: username ? username : anonUsername,
        groupId,
      },
    });
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
          join your session.
        </p>
        <table className='swipe-match-table'>
          <tbody>
            <tr>
              <td>
                <img src={Username} alt='' />
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
                <img src={Place} alt='' />
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
        <button type='submit'>Create</button>
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
                <img src={Username} alt='' />
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
                <img src={Fingerprint} alt='' />
              </td>
              <td>
                <label htmlFor='groupId'>Group ID</label>
              </td>
              <td>
                <input
                  type='text'
                  name='groupId'
                  value={groupId}
                  onChange={(event) => setGroupId(event.target.value)}
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
