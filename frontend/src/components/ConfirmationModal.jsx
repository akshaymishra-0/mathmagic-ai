import React from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const confirmButtonClass =
    type === "danger"
      ? "flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
      : "flex-1 px-4 py-2.5 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl hover:opacity-90 transition-all font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative max-w-sm w-full bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-dark-hover rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-dark-hover hover:bg-dark-border text-gray-300 rounded-xl transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={confirmButtonClass}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
