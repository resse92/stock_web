import React from 'react';
import { TanStackTableDemo } from './TanStackTableDemo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 right-0 h-screen bg-background border-l z-50
        transition-transform duration-300 ease-in-out
        w-96 lg:w-96
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">TanStack Demo</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-muted"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <TanStackTableDemo />
          </div>
        </div>
      </div>
    </>
  );
};