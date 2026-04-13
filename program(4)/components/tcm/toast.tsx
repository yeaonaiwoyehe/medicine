'use client';

import { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'warning' | 'error';
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-[#1a4d2e] to-[#2d6a4f]',
      icon: 'fa-check-circle',
    },
    warning: {
      bg: 'bg-gradient-to-r from-[#d97706] to-[#f59e0b]',
      icon: 'fa-exclamation-triangle',
    },
    error: {
      bg: 'bg-gradient-to-r from-[#dc2626] to-[#ef4444]',
      icon: 'fa-times-circle',
    },
  };

  const currentStyle = styles[type];

  return (
    <div 
      className={`fixed top-24 right-4 z-50 ${currentStyle.bg} text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300`}
      role="alert"
    >
      <i className={`fa-solid ${currentStyle.icon} text-xl`}></i>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
        aria-label="关闭"
      >
        <i className="fa-solid fa-times text-sm"></i>
      </button>
    </div>
  );
}
