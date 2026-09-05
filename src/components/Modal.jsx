import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-amber-100 dark:border-stone-800 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100/80 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-900/50">
          <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
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
