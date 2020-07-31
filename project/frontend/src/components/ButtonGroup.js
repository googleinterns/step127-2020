import React from 'react';
import './ButtonGroup.css';

function ButtonGroup(props) {
  // an array of all the button labels is going to be passed into the props.
  const { labelList } = props;
  const buttonList = [];
  for (let delta = 0; delta < labelList.length; delta++) {
    buttonList.push(<button>{labelList[delta]}</button>);
  }
  return <div className='btn-group'>{buttonList}</div>;
}

export default ButtonGroup;
