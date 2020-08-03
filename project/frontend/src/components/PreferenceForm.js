import React from 'react';
import './PreferenceForm.css';

function PreferenceForm(props) {
  const { headerLabel } = props;
  return (
    <div className='form-container'>
      <form className='form'>
        <h4 className='header'>{headerLabel}</h4>
        {props.children}
        <div className='form-submit-container'>
          <button type='submit'>Update Profile</button>
        </div>
      </form>
    </div>
  );
}
export default PreferenceForm;
