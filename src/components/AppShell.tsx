"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, MapPin, Users, Menu, X, Leaf, Zap, Route, CalendarDays } from 'lucide-react';


interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Strategic Calendar',
      href: '/calendar',
      icon: Calendar,
      description: 'Yearly and monthly view of all scheduled services'
    },
    {
      name: 'Daily Dashboard',
      href: '/dashboard',
      icon: MapPin,
      description: 'Mission control for daily route optimization'
    },
    {
      name: 'Crew Management',
      href: '/crews',
      icon: Users,
      description: 'Manage crew assignments and schedules'
    },
    {
      name: 'Crew Schedule',
      href: '/schedule',
      icon: CalendarDays,
      description: 'Weekly schedule view for crew leaders and teams'
    },
    {
      name: 'Route Optimization',
      href: '/routes',
      icon: Route,
      description: 'AI-powered route optimization with real-time tracking'
    },
    {
      name: 'Enhanced Demo',
      href: '/demo',
      icon: Zap,
      description: 'Real-time updates and interactive scenarios'
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  CPM AI
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Schedule Demo
                </p>
              </div>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground/80">
                      {item.description}
                    </div>
                  </div>
                </a>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-primary-foreground">
                  DM
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  Dave Miller
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  Operations Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col w-full">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-accent text-foreground flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-foreground truncate">
                Mission Control Dashboard
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Optimize your crew schedules and routes
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span>System Active</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-foreground">Dave Miller</p>
                <p className="text-xs text-muted-foreground">Operations Manager</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-foreground">
                  DM
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-background">
          <div className="min-h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
