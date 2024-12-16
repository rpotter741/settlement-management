import React from 'react';

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="relative bg-background p-6 rounded-lg w-full max-w-md shadow-lg">
      <h3 className="text-primary font-bold text-lg mb-4">{title}</h3>
      <div className="text-secondary mb-4">{children}</div>
      <button
        className="absolute top-2 right-2 text-secondary bg-transparent border-none text-xl cursor-pointer"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  </div>
);

export default Modal;
