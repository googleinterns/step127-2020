import './SwipeMatchPage.css';

import React from 'react';

function SwipeMatchPage(props) {
  const { currLocation, action, username, groupId } = props.location.state;
  
  return (
    <div>
      {currLocation}
      {action}
      {username}
      {groupId}
    </div>
  );
}

export default SwipeMatchPage;
