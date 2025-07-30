'use client';

import { TwoSidebarLayout } from '@/components/TwoSidebarLayout';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Home() {
  const { toggleLeftSidebar, toggleRightSidebar, leftSidebarOpen, rightSidebarOpen } = useSidebar();

  return (
    <TwoSidebarLayout>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Main Content Area</h1>
        <p className="text-lg">This is the middle section that reacts to sidebar toggles</p>
        
        <div className="flex gap-4">
          <button
            onClick={toggleLeftSidebar}
            className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
            {leftSidebarOpen ? 'Hide Left' : 'Show Left'}
          </button>
          
          <button
            onClick={toggleRightSidebar}
            className="px-6 py-3 bg-white text-red-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
            {rightSidebarOpen ? 'Hide Right' : 'Show Right'}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-75">
            Left Sidebar: {leftSidebarOpen ? 'Open' : 'Closed'} | 
            Right Sidebar: {rightSidebarOpen ? 'Open' : 'Closed'}
          </p>
        </div>
      </div>
    </TwoSidebarLayout>
  );
}
