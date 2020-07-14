import './Modal.css';

import React from 'react';

/**
 * A modal window with a fixed position on the viewport.
 *
 * @param {boolean} props.open True if the modal should be shown; false if it
 *     should be hidden.
 * @param {string} props.top Space from the top of the viewport to the top
 *     of this modal.
 * @param {string} props.right Space from the right of the viewport to the right
 *     of this modal.
 * @param {string} props.bottom Space from the bottom of the viewport to the bottom
 *     of this modal.
 * @param {string} props.left Space from the left of the viewport to the left
 *     of this modal.
 * @param {function(): undefined} props.onDismiss Callback for when modal is
 *     dismissed by touching modal backdrop, should update props.open to false.
 * @param {boolean=} props.center True if the modal should be horizontally and vertically
 *     centered; false otherwise (default: false).
 * @param {boolean=} props.centerHorizontal True if the modal should be horizontally
 *     centered; false otherwise (default: false).
 */
function Modal(props) {
  const {
    open,
    top,
    right,
    bottom,
    left,
    onDismiss,
    center = false,
    centerHorizontal = false,
  } = props;

  const backdropStyle = { height: open ? '' : '0px' };

  let modalStyle = { opacity: open ? 1 : 0 };
  if (center) {
    modalStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      ...modalStyle,
    };
  } else if (centerHorizontal) {
    modalStyle = {
      top,
      bottom,
      left: '50%',
      transform: 'translateX(-50%)',
      ...modalStyle,
    };
  } else {
    modalStyle = { top, right, bottom, left, ...modalStyle };
  }

  const dontDismiss = (event) => {
    event.stopPropagation();
  };

  return (
    <div className='modal-backdrop' onClick={onDismiss} style={backdropStyle}>
      <div className='modal' onClick={dontDismiss} style={modalStyle}>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
