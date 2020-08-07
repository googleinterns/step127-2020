import './ButtonGroup.css';

import React, { useState } from 'react';

/**
 * A list of labelList.length buttons with the labels in labelList.
 *
 * @param {string} id The id of the button group.
 * @param {!Array<string>} labelList The list of labels for the buttons.
 * @param {function} sendCheckedButtons A callback function to send the checked
 *    buttons map to this component's parent.
 */
function ButtonGroup(props) {
  const { id, labelList, sendCheckedButtons } = props;
  const isSelectedInitial = {};
  for (let labelIndex = 0; labelIndex < labelList.length; labelIndex++) {
    isSelectedInitial[labelIndex] = false;
  }
  const [isSelected, setIsSelected] = useState(isSelectedInitial);

  const onClickButton = (props) => {
    let tempIsSelected = Object.assign({}, isSelected);
    tempIsSelected[props] = !tempIsSelected[props];
    setIsSelected(tempIsSelected);
    sendCheckedButtons(id, tempIsSelected);
  };

  const createButtons = () => {
    const buttonList = [];
    for (let buttonIndex = 0; buttonIndex < labelList.length; buttonIndex++) {
      let className = isSelected[buttonIndex]
        ? 'is-selected-class'
        : 'not-selected-class';
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
