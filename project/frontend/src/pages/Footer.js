import './Footer.css';

import React from 'react';

function Footer() {
  return (
    <div className='container u-full-width'>
      <div className='row-flex feedback u-pad48'>
        <h4>Have any feedback?</h4>
        <button>Let us know</button>
      </div>
      <div id='footer'>
        <h5>Brought to you by Miah, Alex, and Kira</h5>
      </div>
    </div>
  );
}

export default Footer;
