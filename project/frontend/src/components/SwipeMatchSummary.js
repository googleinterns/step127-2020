import './SwipeMatchSummary.css';

import React from 'react';

import { useHistory } from 'react-router-dom';

import ConnectedUserChip from './ConnectedUserChip.js';
import RestaurantCard from './RestaurantCard.js';

import ThumbDown from '../assets/thumb_down.svg';
import ThumbUp from '../assets/thumb_up.svg';

function SwipeMatchSummary(props) {
  const { restaurants, users, likes } = props;

  const history = useHistory();

  if (restaurants.length === 0) {
    return null;
  }

  const topPick = restaurants[0];
  const id = topPick.key.id;
  const name = topPick.key.name;
  const votes = topPick.fractionLiked * users.length;
  const userLikes = likes[id];

  return (
    <div className='swipe-match-summary'>
      <h4>
        Your top pick was{' '}
        {<h4 className='swipe-match-summary-name'>{name + ' '}</h4>}
        with {votes} out of {users.length} votes!
      </h4>
      <div className='swipe-match-summary-card-container'>
        <div>
          <RestaurantCard restaurant={topPick} />
        </div>
      </div>
      <table>
        <tbody>
          <tr>
            <td>
              <img src={ThumbUp} alt='Thumb up' />
            </td>
            <td>
              <label>Likes</label>
            </td>
            <td>
              {userLikes &&
                userLikes.map((user) => (
                  <ConnectedUserChip key={user} username={user} />
                ))}
            </td>
          </tr>
          {userLikes && userLikes.length < users.length && (
            <tr>
              <td>
                <img src={ThumbDown} alt='Thumb down' />
              </td>
              <td>
                <label>Dislikes</label>
              </td>
              <td>
                {userLikes &&
                  users.map((user) =>
                    !userLikes.includes(user) ? (
                      <ConnectedUserChip key={user} username={user} />
                    ) : null
                  )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => history.replace('/')}>Homepage</button>
    </div>
  );
}

export default SwipeMatchSummary;
