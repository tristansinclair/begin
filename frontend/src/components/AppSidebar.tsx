'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Heart,
  Home,
  FileText
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
    title: 'Overview',
    icon: Home,
    url: '/',
  },
  {
    title: 'Workouts',
    icon: Dumbbell,
    url: '/today', // TODO: add a page that shows the current day + past workouts, for /workouts
    items: [
      { title: "Today's Workout", icon: Calendar, url: '/today' },
      { title: 'History', icon: History, url: '/workouts' },
    ],
  },
  {
    title: 'Plans',
    icon: BookOpen,
    url: '/plans/current', // TODO: add a page that is for just /plans?
    items: [
      { title: 'Current Plan', icon: Trophy, url: '/plans/current' },
      { title: 'Create Plan', icon: Plus, url: '/plans/create' },
      { title: 'Plan History', icon: History, url: '/plans/history' },
    ],
  },
  {
    title: 'Profile',
    icon: User,
    url: '/profile',
    // items: [
    //   { title: 'My Stats', icon: BarChart3, url: '/profile/stats' },
    //   { title: 'Preferences', icon: Heart, url: '/profile/preferences' },
    // ],
  },
  {
    title: 'Examples',
    icon: FileText,
    url: '/plan/example',
    items: [
      { title: 'Sample Plan', icon: BookOpen, url: '/plan/example' },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">BEGIN</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                item.items ? (
                  <Collapsible key={item.title} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <div className="flex items-center">
                        <SidebarMenuButton asChild isActive={isActive(item.url)} className="flex-1">
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        <CollapsibleTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                                <Link href={subItem.url}>
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/profile">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">My Account</span>
                  <span className="truncate text-xs">Manage settings</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}