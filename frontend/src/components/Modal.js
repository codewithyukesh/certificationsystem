// src/components/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content a4-format">
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
