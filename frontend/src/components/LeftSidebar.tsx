'use client';

import React, { useState } from 'react';

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavSection {
  title: string;
  items: DropdownItem[];
}

const LeftSidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navSections: NavSection[] = [
    {
      title: 'Workouts',
      items: [
        { label: 'Today\'s Workout', href: '/workouts/today' },
        { label: 'Browse Library', href: '/workouts/library' },
        { label: 'Custom Workouts', href: '/workouts/custom' },
        { label: 'History', href: '/workouts/history' }
      ]
    },
    {
      title: 'Plans',
      items: [
        { label: 'Current Plan', href: '/plans/current' },
        { label: 'Browse Plans', href: '/plans/browse' },
        { label: 'Create Plan', href: '/plans/create' },
        { label: 'Plan History', href: '/plans/history' }
      ]
    },
    {
      title: 'Profile',
      items: [
        { label: 'My Stats', href: '/profile/stats' },
        { label: 'Progress Photos', href: '/profile/photos' },
        { label: 'Settings', href: '/profile/settings' },
        { label: 'Preferences', href: '/profile/preferences' }
      ]
    }
  ];

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Begin</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <button
              onClick={() => toggleDropdown(section.title)}
              className="w-full flex items-center justify-between p-3 text-foreground hover:bg-accent rounded-lg transition-colors duration-200 group"
            >
              <span className="font-medium">{section.title}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === section.title ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Items */}
            {openDropdown === section.title && (
              <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {section.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full text-left p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Account Section */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 p-3 text-foreground hover:bg-accent rounded-lg transition-colors duration-200">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">My Account</div>
            <div className="text-xs text-muted-foreground">Manage settings</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;