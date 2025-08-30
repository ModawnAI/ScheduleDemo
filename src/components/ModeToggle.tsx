"use client";

import React from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Zap, Calendar } from 'lucide-react';

const ModeToggle: React.FC = () => {
  const { setMode, isSimpleMode, isAdvancedMode } = useAppMode();

  const handleToggle = (checked: boolean) => {
    setMode(checked ? 'advanced' : 'simple');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-3 bg-sidebar-accent/50 border border-sidebar-border rounded-lg">
        {/* Simple Mode Side */}
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Calendar className={`h-4 w-4 flex-shrink-0 transition-colors ${isSimpleMode ? 'text-sidebar-primary' : 'text-sidebar-foreground/40'}`} />
          <Label 
            htmlFor="mode-toggle" 
            className={`text-sm font-medium cursor-pointer transition-colors truncate ${isSimpleMode ? 'text-sidebar-foreground' : 'text-sidebar-foreground/60'}`}
          >
            Basic
          </Label>
        </div>
        
        {/* Switch */}
        <div className="flex-shrink-0 mx-3">
          <Switch
            id="mode-toggle"
            checked={isAdvancedMode}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-sidebar-primary"
          />
        </div>
        
        {/* Advanced Mode Side */}
        <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
          <Label 
            htmlFor="mode-toggle" 
            className={`text-sm font-medium cursor-pointer transition-colors truncate ${isAdvancedMode ? 'text-sidebar-foreground' : 'text-sidebar-foreground/60'}`}
          >
            Pro
          </Label>
          <Zap className={`h-4 w-4 flex-shrink-0 transition-colors ${isAdvancedMode ? 'text-sidebar-primary' : 'text-sidebar-foreground/40'}`} />
        </div>
      </div>
      
      {/* Description */}
      <div className="mt-2 text-center">
        <p className="text-xs text-sidebar-foreground/60">
          {isSimpleMode ? 'AI Scheduling Generator' : 'Full Dashboard Suite'}
        </p>
      </div>
    </div>
  );
};

export default ModeToggle;
