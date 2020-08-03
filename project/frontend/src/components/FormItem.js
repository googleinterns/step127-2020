import React from 'react';
import './FormItem.css';

function FormItem(props) {
  const { label, imageName } = props;
  return (
    <div className='row'>
      <img src={imageName} alt='' />
      <label>{label}</label>
      {props.children}
    </div>
  );
}

export default FormItem;
