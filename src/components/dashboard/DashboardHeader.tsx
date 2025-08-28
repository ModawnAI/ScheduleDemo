"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome to CPM AI
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground mt-1">
            Integrated scheduling and dynamic routing for landscaping operations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Activity className="w-3 h-3 mr-1" />
            System Active
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-card border border-border">
          <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 self-center sm:self-auto">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-card-foreground">Active Contracts</p>
            <p className="text-base sm:text-lg font-bold text-primary">24</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-card border border-border">
          <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 self-center sm:self-auto">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-card-foreground">Active Crews</p>
            <p className="text-base sm:text-lg font-bold text-primary">4</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-card border border-border">
          <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 self-center sm:self-auto">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-card-foreground">Today&apos;s Jobs</p>
            <p className="text-base sm:text-lg font-bold text-primary">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
