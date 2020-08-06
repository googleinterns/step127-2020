import './ConnectedUserChip.css';

import React from 'react';

import Cancel from '../assets/cancel.svg';

function ConnectedUserChip(props) {
  const { username, kickable, onKick = () => {} } = props;

  const style = { padding: '4px 8px 4px 12px' };

  return (
    <div className='connected-user-chip' style={kickable ? style : null}>
      <p>{username}</p>
      {kickable && (
        <img onClick={() => onKick(username)} src={Cancel} alt='Kick user' />
      )}
    </div>
  );
}

export default ConnectedUserChip;
