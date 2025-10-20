import React from 'react';
import { X, LogOut, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-orange-400" />;
      case 'danger':
        return <LogOut className="w-8 h-8 text-red-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-accent-purple" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      default:
        return 'bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-md w-full bg-gradient-to-br from-dark-card/95 to-dark-card/90 backdrop-blur-xl rounded-2xl border border-dark-border/50 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-dark-hover/50 to-dark-border/30 rounded-full border border-dark-border/50">
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-center text-white mb-4">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-300 text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-dark-hover hover:bg-dark-border text-gray-300 hover:text-white rounded-xl transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${getConfirmButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;