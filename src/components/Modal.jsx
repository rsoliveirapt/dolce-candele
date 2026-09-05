import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001229]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white dark:bg-[#001f42] text-[#002a59] dark:text-[#fadbc7] rounded-2xl shadow-2xl border border-[#fadbc7] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#fadbc7] bg-[#fadbc7]/30 dark:bg-[#002a59]/60">
          <h3 className="text-xl font-extrabold text-[#002a59] dark:text-[#fadbc7] flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#002a59] hover:bg-[#fadbc7]/60 dark:text-[#fadbc7] dark:hover:bg-[#003b7a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)] space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
