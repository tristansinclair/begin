'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet } from '@/components/ui/sheet';

interface TwoSidebarLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
}

const SidebarContent: React.FC<{ 
  children: ReactNode; 
  onClose?: () => void; 
  isMobile?: boolean;
  bgColor?: string;
}> = ({ 
  children, 
  onClose,
  isMobile,
  bgColor = 'bg-blue-500'
}) => (
  <div className={`w-full h-full ${bgColor}`}>
    {isMobile && onClose && (
      <div className="flex justify-end p-4 pb-2">
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>
    )}
    <div className="p-4 text-white">
      {children}
    </div>
  </div>
);

export const TwoSidebarLayout: React.FC<TwoSidebarLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
}) => {
  const { leftSidebarOpen, rightSidebarOpen, toggleLeftSidebar, toggleRightSidebar } = useSidebar();
  const { isMobile } = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const leftContent = leftSidebar || (
    <div>
      <h2 className="text-lg font-bold mb-4">Left Sidebar</h2>
      <p>This is the left sidebar content.</p>
    </div>
  );

  const rightContent = rightSidebar || (
    <div>
      <h2 className="text-lg font-bold mb-4">Right Sidebar</h2>
      <p>This is the right sidebar content.</p>
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-green-500" suppressHydrationWarning>
      {/* Left Sidebar - Always render but control position */}
      <div
        className={`bg-blue-500 w-64 transition-transform duration-300 ease-in-out absolute left-0 top-0 h-full z-10 ${
          isMobile
            ? '-translate-x-full' // Always hide desktop sidebar on mobile
            : leftSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <SidebarContent>{leftContent}</SidebarContent>
      </div>

      {/* Mobile Left Sheet */}
      {mounted && isMobile && (
        <Sheet
          open={leftSidebarOpen}
          onOpenChange={toggleLeftSidebar}
          side="left"
        >
          <SidebarContent 
            onClose={() => toggleLeftSidebar()} 
            isMobile 
            bgColor="bg-blue-500"
          >
            {leftContent}
          </SidebarContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col items-center justify-center text-white transition-all duration-300 ease-in-out ${
          !isMobile
            ? `${leftSidebarOpen ? 'ml-64' : 'ml-0'} ${rightSidebarOpen ? 'mr-64' : 'mr-0'}`
            : 'ml-0 mr-0'
        }`}
      >
        {children}
      </div>

      {/* Right Sidebar - Always render but control position */}
      <div
        className={`bg-red-500 w-64 transition-transform duration-300 ease-in-out absolute right-0 top-0 h-full z-10 ${
          isMobile
            ? 'translate-x-full' // Always hide desktop sidebar on mobile
            : rightSidebarOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        <SidebarContent>{rightContent}</SidebarContent>
      </div>

      {/* Mobile Right Sheet */}
      {mounted && isMobile && (
        <Sheet
          open={rightSidebarOpen}
          onOpenChange={toggleRightSidebar}
          side="right"
        >
          <SidebarContent 
            onClose={() => toggleRightSidebar()} 
            isMobile 
            bgColor="bg-red-500"
          >
            {rightContent}
          </SidebarContent>
        </Sheet>
      )}
    </div>
  );
};