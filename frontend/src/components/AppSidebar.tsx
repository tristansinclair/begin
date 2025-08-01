'use client';

import React from 'react';
import { 
  Calendar, 
  Dumbbell, 
  User, 
  Trophy, 
  History,
  Library,
  Plus,
  Settings,
  Camera,
  BarChart3,
  BookOpen,
  Heart
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const menuItems = [
  {
    title: 'Workouts',
    icon: Dumbbell,
    items: [
      { title: "Today's Workout", icon: Calendar, url: '/workouts/today' },
      { title: 'Browse Library', icon: Library, url: '/workouts/library' },
      { title: 'Custom Workouts', icon: Plus, url: '/workouts/custom' },
      { title: 'History', icon: History, url: '/workouts/history' },
    ],
  },
  {
    title: 'Plans',
    icon: BookOpen,
    items: [
      { title: 'Current Plan', icon: Trophy, url: '/plan' },
      { title: 'Browse Plans', icon: Library, url: '/plans/browse' },
      { title: 'Create Plan', icon: Plus, url: '/plans/create' },
      { title: 'Plan History', icon: History, url: '/plans/history' },
    ],
  },
  {
    title: 'Profile',
    icon: User,
    items: [
      { title: 'My Stats', icon: BarChart3, url: '/profile/stats' },
      { title: 'Progress Photos', icon: Camera, url: '/profile/photos' },
      { title: 'Settings', icon: Settings, url: '/profile/settings' },
      { title: 'Preferences', icon: Heart, url: '/profile/preferences' },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">Begin</span>
          </a>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <Collapsible key={item.title} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/profile">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">My Account</span>
                  <span className="truncate text-xs">Manage settings</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}