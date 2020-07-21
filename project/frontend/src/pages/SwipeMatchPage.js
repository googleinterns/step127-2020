import React, { useState, useEffect } from 'react';

function SwipeMatchPage(props) {
  const username = props.location.state.username;

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/swipematch');

    eventSource.addEventListener('userconnect', (event) => {
      console.log(event.data);
      setUsers((prev) => [...prev, event.data]);
    });

    fetch('/api/swipematch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'username=' + username,
    });
  }, []);

  return (
    <div>
      {users.map((user) => (
        <span>user</span>
      ))}
    </div>
  );
}
