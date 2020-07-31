import './ButtonGroup.css';

import React, { useState } from 'react';

/**
 * A list of labelList.length buttons with the labels in labelList.
 *
 * @param {!Array<string>} labelList The list of labels for the buttons
 */
function ButtonGroup(props) {
  const { labelList } = props;
  const [buttonBackground, setButtonBackground] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const onClickButton = (props) => {
    let buttonBackgroundTemp = Object.assign({}, buttonBackground);
    buttonBackgroundTemp[props] = !buttonBackgroundTemp[props];
    setButtonBackground(buttonBackgroundTemp);
    console.log(buttonBackground);
  };

  const createButtons = () => {
    const buttonList = [];
    for (let delta = 0; delta < labelList.length; delta++) {
      console.log(buttonBackground[delta]);
      let className = buttonBackground[delta]
        ? 'not-clicked-class'
        : 'clicked-class';
      console.log(className);
      const buttonStyle = { backgroundColor: buttonBackground[delta] };
      buttonList.push(
        <button
          type='button'
          onClick={() => onClickButton(delta)}
          className={className}>
          {labelList[delta]}
        </button>
      );
    }
    console.log(buttonList);
    return buttonList;
  };

  return <div className='btn-group'>{createButtons()}</div>;
}

export default ButtonGroup;
