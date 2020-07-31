import './ButtonGroup.css';

import React, { useState } from 'react';

/**
 * A list of labelList.length buttons with the labels in labelList.
 *
 * @param {!Array<string>} labelList The list of labels for the buttons
 */
function ButtonGroup(props) {
  const { labelList } = props;
  const [backgroundIsGray, setBackgroundIsGray] = useState({
    button0: false,
    button1: false,
    button2: false,
    button3: false,
  });

  const onClickButton = (props) => {
    let tempBackgroundIsGray = Object.assign({}, backgroundIsGray);
    tempBackgroundIsGray[props] = !tempBackgroundIsGray[props];
    setBackgroundIsGray(tempBackgroundIsGray);
  };

  const createButtons = () => {
    const buttonList = [];
    for (let delta = 0; delta < labelList.length; delta++) {
      let className = backgroundIsGray[delta]
        ? 'not-clicked-class'
        : 'clicked-class';
      buttonList.push(
        <button
          type='button'
          onClick={() => onClickButton(delta)}
          className={className}>
          {labelList[delta]}
        </button>
      );
    }
    return buttonList;
  };

  return <div className='btn-group'>{createButtons()}</div>;
}

export default ButtonGroup;
