'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
  children: ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  side = 'left',
  children,
}) => {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Don't render anything if not in browser
  if (typeof window === 'undefined') {
    return null;
  }

  const sheetContent = (
    <>
      {/* Backdrop - Always rendered but controlled by opacity and pointer events */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 9999 }}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet Content - Slides over entire view */}
      <div
        className={`fixed inset-y-0 ${
          side === 'left' ? 'left-0' : 'right-0'
        } w-80 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open 
            ? 'translate-x-0' 
            : side === 'left' 
              ? '-translate-x-full' 
              : 'translate-x-full'
        }`}
        style={{ zIndex: 10000 }}
      >
        {children}
      </div>
    </>
  );

  // Render the sheet content at the body level using a portal
  return createPortal(sheetContent, document.body);
};