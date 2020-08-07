import './SwipeMatchHeader.css';

import React from 'react';

import Fingerprint from '../assets/fingerprint.svg';
import Group from '../assets/group.svg';
import Username from '../assets/username.svg';

function SwipeMatchHeader(props) {
  const {
    groupId,
    username,
    users,
    isCreator,
    endSession,
    leaveSession,
    visible,
  } = props;

  return (
    <div
      className='swipe-match-header'
      style={{
        height: visible ? '48px' : '0px',
      }}>
      <div>
        <img src={Fingerprint} alt='Group id' />
        <span>{groupId}</span>
        <img src={Username} alt='Username' />
        <span>{username}</span>
        <img src={Group} alt='Connected users' />
        <span>{users.length}</span>
      </div>
      {isCreator ? (
        <button onClick={endSession}>End Session</button>
      ) : (
        <button onClick={leaveSession}>Leave Session</button>
      )}
    </div>
  );
}

export default SwipeMatchHeader;
