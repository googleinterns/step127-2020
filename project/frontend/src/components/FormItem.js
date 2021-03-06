import React from 'react';
import './FormItem.css';

function FormItem(props) {
  const { label, imageName } = props;
  return (
    <div className='form-item-row'>
      <img src={imageName} alt={label + ' icon'} />
      <label>{label}</label>
      {props.children}
    </div>
  );
}

export default FormItem;
