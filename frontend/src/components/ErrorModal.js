// src/components/ErrorModal.js
import React from 'react';
import './ErrorModal.css';

const ErrorModal = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target.className === 'error-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="error-modal-backdrop" onClick={handleOverlayClick}>
      <div className="error-modal-content">
        <button className="error-modal-close" onClick={onClose}>X</button>
        <h3 className="error-modal-title">Error</h3>
        <p className="error-modal-message">{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
