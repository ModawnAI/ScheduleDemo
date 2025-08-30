"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppMode } from '@/contexts/AppModeContext';
import { 
  Home, 
  Building2, 
  Settings, 
  Bell,
  Menu,
  X,
  Calendar,
  Users,
  Route,
  Zap
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

// Navigation items for different modes
const simpleNavigation = [
  { name: 'Work Orders', href: '/', icon: Home, badge: '12' },
  { name: 'Schedule Generator', href: '/schedule', icon: Calendar, badge: 'New' },
];

const advancedNavigation = [
  { name: 'Work Orders', href: '/', icon: Home, badge: '12' },
  { name: 'Dashboard', href: '/dashboard', icon: Building2 },
  { name: 'Schedule Generator', href: '/schedule', icon: Calendar, badge: 'New' },
  { name: 'Calendar View', href: '/calendar', icon: Calendar },
  { name: 'Crews', href: '/crews', icon: Users },
  { name: 'Routes', href: '/routes', icon: Route },
  { name: 'Demo Features', href: '/demo', icon: Zap, badge: 'Enhanced' },
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { mode, setMode } = useAppMode();
  
  // Get navigation items based on current mode
  const navigation = mode === 'simple' ? simpleNavigation : advancedNavigation;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">Schedule Demo</h1>
            <Badge variant={mode === 'advanced' ? 'default' : 'secondary'} className="text-xs">
              {mode === 'advanced' ? 'Pro' : 'Basic'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="lg:flex">
        {/* Sidebar */}
        <div className={cn(
          "lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0",
          mobileMenuOpen ? "block" : "hidden lg:block"
        )}>
          <div className="flex flex-col flex-grow bg-card border-r overflow-y-auto">
            <div className="flex flex-col flex-shrink-0 px-4 py-6 space-y-4">
              <h1 className="text-xl font-bold text-foreground">Schedule Demo</h1>
              
              {/* Simple/Advanced Mode Toggle */}
              <div className="flex flex-col space-y-2 p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="mode-toggle" className="text-sm font-medium">
                    {mode === 'simple' ? 'Simple' : 'Advanced'}
                  </Label>
                  <Switch
                    id="mode-toggle"
                    checked={mode === 'advanced'}
                    onCheckedChange={(checked) => setMode(checked ? 'advanced' : 'simple')}
                  />
                  <Badge variant={mode === 'advanced' ? 'default' : 'secondary'} className="text-xs">
                    {mode === 'advanced' ? 'Pro' : 'Basic'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {navigation.length} menu item{navigation.length !== 1 ? 's' : ''} available
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                    {item.name}
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "secondary" : "outline"} 
                        className={cn(
                          "ml-auto text-xs",
                          isActive ? "bg-primary-foreground/20 text-primary-foreground" : ""
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">GM</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">Green Manager</p>
                  <p className="text-xs text-muted-foreground">Operations Lead</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-background border-b">
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex-1" />
              <div className="ml-4 flex items-center md:ml-6">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    2
                  </Badge>
                </Button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}