import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Place from '../assets/place.svg';

function SwipeMatchForm(props) {
  const { currLocation, locationName } = props;

  const history = useHistory();

  const [groupId, setGroupId] = useState('');

  const createSession = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/swipe-match',
      state: { currLocation },
    });
  };

  const joinSession = (event) => {
    event.preventDefault();
    history.push({
      pathname: '/swipe-match',
      state: { currLocation },
    });
  };
  
  return (
    <div className='preference-form-container'>
      <form onSubmit={createSession}>
        <h4>Create a new session.</h4>
        <p>
          This is some instruction.
        </p>
        <div className='preference-form-row'>
          <img src={Place} alt='' />
          <label>Location</label>
          <p>{locationName}</p>
        </div>
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
          This is some different instruction.
        </p>
        <input
          type='text'
          name='groupId'
          value={groupId}
          onChange={(event) => setGroupId(event.target.value)}
          placeholder='Enter a group ID' />
        <button type='submit'>Join</button>
      </form>
    </div>
  );
}

export default SwipeMatchForm;
