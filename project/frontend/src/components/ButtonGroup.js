import './ButtonGroup.css';

import React, { useState } from 'react';

/**
 * A list of labelList.length buttons with the labels in labelList.
 *
 * @param {!Array<string>} labelList The list of labels for the buttons
 */
function ButtonGroup(props) {
  const { labelList } = props;
  const isSelectedInitial = {};
  for (let buttonIndex = 0; buttonIndex < labelList.length; buttonIndex++) {
    isSelectedInitial[`button${buttonIndex}`] = false;
  }
  const [isSelected, setIsSelected] = useState(isSelectedInitial);

  const onClickButton = (props) => {
    let tempIsSelected = Object.assign({}, isSelected);
    tempIsSelected[props] = !tempIsSelected[props];
    setIsSelected(tempIsSelected);
  };

  const createButtons = () => {
    const buttonList = [];
    for (let buttonIndex = 0; buttonIndex < labelList.length; buttonIndex++) {
      let className = isSelected[buttonIndex]
        ? 'not-clicked-class'
        : 'clicked-class';
      buttonList.push(
        <button
          type='button'
          onClick={() => onClickButton(buttonIndex)}
          className={className}>
          {labelList[buttonIndex]}
        </button>
      );
    }
    return buttonList;
  };

  return <div className='btn-group'>{createButtons()}</div>;
}

export default ButtonGroup;
