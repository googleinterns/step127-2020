import './SwipeMatchConsole.css';

import React from 'react';

import ConnectedUserChip from './ConnectedUserChip.js';

import Fingerprint from '../assets/fingerprint.svg';
import Group from '../assets/group.svg';
import Username from '../assets/username.svg';

function SwipeMatchConsole(props) {
  const { username, groupId, users, isCreator, startSession, kickUser } = props;

  return (
    <div className='swipe-match-console'>
      <h4>Welcome to Swipe Match.</h4>
      <p>
        Below you will find a group ID to share with others so they may join the
        session.
        {isCreator
          ? ' As the session leader, you may moderate the connected users and ' +
            'are responsible for starting the session once restaurants have been ' +
            'retrieved. You may start the session at any time, and users may still ' +
            'join after you have begun the session.'
          : ' Please wait for the session leader to begin the session.'}
      </p>
      <table className='swipe-match-console-table'>
        <tbody>
          <tr>
            <td>
              <img src={Fingerprint} alt='Group ID' />
            </td>
            <td>
              <label>Group ID</label>
            </td>
            <td>
              <p>{groupId === null ? 'Failed to generate code.' : groupId}</p>
            </td>
          </tr>
          <tr>
            <td>
              <img src={Username} alt='Username' />
            </td>
            <td>
              <label>Username</label>
            </td>
            <td>
              <p>{username}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='swipe-match-console-header'>
        <img src={Group} alt='Connected users' />
        <label>Connected Users</label>
      </div>
      <div className='swipe-match-console-connected-users'>
        <ConnectedUserChip username={username} />
        {users.map((user) => {
          if (user !== username) {
            return (
              <ConnectedUserChip
                key={user}
                username={user}
                kickable={isCreator}
                onKick={() => {
                  if (isCreator) kickUser(user);
                }}
              />
            );
          } else return null;
        })}
      </div>
      {isCreator ? (
        <button
          onClick={startSession}
          className='swipe-match-console-start-session'>
          Start Session
        </button>
      ) : (
        <button className='swipe-match-console-waiting'>
          Waiting for leader to begin the session...
        </button>
      )}
    </div>
  );
}

export default SwipeMatchConsole;
