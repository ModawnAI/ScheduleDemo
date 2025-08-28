"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Plus, Settings } from 'lucide-react';

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = "" }) => {
  const actions = [
    {
      title: 'View Calendar',
      description: 'Strategic planning view',
      icon: Calendar,
      href: '/calendar',
      variant: 'secondary' as const,
    },
    {
      title: 'Daily Dashboard',
      description: 'Mission control center',
      icon: MapPin,
      href: '/dashboard',
      variant: 'secondary' as const,
    },
    {
      title: 'Manage Crews',
      description: 'Team assignments',
      icon: Users,
      href: '/crews',
      variant: 'outline' as const,
    },
    {
      title: 'Add New Job',
      description: 'Create job ticket',
      icon: Plus,
      href: '/jobs/new',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Jump to the most common tasks and views
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="h-auto p-3 sm:p-4 justify-start text-left"
                asChild
              >
                <a href={action.href} className="flex items-center gap-2 sm:gap-3 w-full">
                  <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 flex-shrink-0">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm truncate">{action.title}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {action.description}
                    </div>
                  </div>
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
