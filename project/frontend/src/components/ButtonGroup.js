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
  for (let labelIndex = 0; labelIndex < labelList.length; labelIndex++) {
    isSelectedInitial[`button${labelIndex}`] = false;
  }
  const [isSelected, setIsSelected] = useState(isSelectedInitial);

  // const sendCheckedButtons = (isSelected) => {
  //   props.sendCheckedButtons(isSelected);
  // };

  const onClickButton = (props) => {
    let tempIsSelected = Object.assign({}, isSelected);
    tempIsSelected[`button${props}`] = !tempIsSelected[`button${props}`];
    setIsSelected(tempIsSelected);
    console.log(isSelected);
    // sendCheckedButtons(isSelected);
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
