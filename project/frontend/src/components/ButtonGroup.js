import React from 'react';
import './ButtonGroup.css';

function ButtonGroup(props) {
  // TODO: Add spec.
  const { labelList } = props;
  const buttonList = [];
  for (let delta = 0; delta < labelList.length; delta++) {
    buttonList.push(<button>{labelList[delta]}</button>);
  }
  return <div className='btn-group'>{buttonList}</div>;
}

export default ButtonGroup;
