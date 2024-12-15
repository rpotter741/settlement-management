import React from 'react';
import './Modal.css'; // Add your styles here

const Modal = ({ onClose, title, children }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>{title}</h3>
      {children}
      <button className="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export default Modal;
