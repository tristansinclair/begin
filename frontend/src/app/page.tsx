'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export default function Home() {
  const { state } = useSidebar();

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      <div className="mb-4">
        <SidebarTrigger />
      </div>
      <h1 className="text-4xl font-bold">Main Content Area</h1>
      <p className="text-lg">This is the middle section that reacts to sidebar toggles</p>
      
      <div className="text-center">
        <p className="text-sm opacity-75">
          Sidebar: {state === 'expanded' ? 'Open' : 'Closed'}
        </p>
      </div>
    </div>
  );
}
