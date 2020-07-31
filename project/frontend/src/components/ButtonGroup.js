import './ButtonGroup.css';

import React from 'react';

/**
 * A list of labelList.length buttons with the labels in labelList.
 *
 * @param {!Array<string>} labelList The list of labels for the buttons
 */
function ButtonGroup(props) {
  const { labelList } = props;
  const buttonList = [];
  for (let delta = 0; delta < labelList.length; delta++) {
    buttonList.push(<button>{labelList[delta]}</button>);
  }
  return <div className='btn-group'>{buttonList}</div>;
}

export default ButtonGroup;
