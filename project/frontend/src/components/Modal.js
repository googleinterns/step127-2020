import './Modal.css';

import React from 'react';

/**
 * A modal window with a fixed position on the viewport.
 *
 * @param {bool} props.open True if the modal should be shown; false if it
 *     should be hidden.
 * @param {string} props.top Space from the top of the viewport to the top
 *     of this modal.
 * @param {string} props.right Space from the right of the viewport to the right
 *     of this modal.
 * @param {string} props.bottom Space from the bottom of the viewport to the bottom
 *     of this modal.
 * @param {string} props.left Space from the left of the viewport to the left
 *     of this modal.
 * @param {function(): undefined} props.onDismiss Optional callback for when modal
 *     is dismissed by touching modal backdrop.
 */
function Modal(props) {
  const dontDismiss = (event) => {
    event.stopPropagation();
  };

  const backdropStyle = {
    display: props.open ? 'block' : 'none',
  };

  const modalStyle = {
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
  };

  return (
    <div
      className='modal-backdrop'
      onClick={props.onDismiss}
      style={backdropStyle}>
      <div className='modal' onClick={dontDismiss} style={modalStyle}>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
