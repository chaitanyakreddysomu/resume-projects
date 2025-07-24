// components/ui/PopupModal.jsx
import React, { useState } from 'react';

const PopupModal = ({ isOpen, title, message, onClose, type = 'info', onConfirm, showInput = false, inputType = 'text', inputPlaceholder = '', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const typeStyles = {
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(inputValue);
    }
    setInputValue('');
    onClose();
  };

  const handleCancel = () => {
    setInputValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`p-6 rounded-md w-96 shadow-lg bg-white border ${typeStyles[type]} relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        >
          ×
        </button>
        <h2 className="font-bold text-lg mb-2 pr-8">{title}</h2>
        <p className="mb-4">{message}</p>
        
        {showInput && (
          <div className="mb-4">
            <input
              type={inputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
          </div>
        )}
        
        <div className="flex space-x-2">
          {showInput && (
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={showInput ? handleConfirm : onClose}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              showInput 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {showInput ? confirmText : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
