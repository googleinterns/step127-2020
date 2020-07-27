import './Loading.css';

import React from 'react';

/**
 * A small, animated loading icon.
 *
 * @param {!Object<string *>} props.style An optional style object
 *     to be applied to the parent div of this component.
 */
function Loading(props) {
  const { style } = props;
  
  return (
    <div className='loading-ripple' style={style}>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loading;
