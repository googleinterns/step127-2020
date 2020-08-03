import React from 'react';
import './FormItem.css';

function FormItem(props) {
  const { label, imageName } = props;
  return (
    <div className='row'>
      {/*TODO: add an alt prop to be passed in here*/}
      <img src={imageName} alt='' />
      <label>{label}</label>
      {props.children}
    </div>
  );
}

export default FormItem;
