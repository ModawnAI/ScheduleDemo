"use client";

import React, { useState, useEffect } from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle,
  Info,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Settings,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Fuel,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipConfig {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'metric' | 'action' | 'navigation' | 'status';
  priority: 'high' | 'medium' | 'low';
  icon?: React.ComponentType<{ className?: string }>;
  keyboardShortcut?: string;
  relatedFeatures?: string[];
  tips?: string[];
}

interface EnhancedTooltipProps {
  config: TooltipConfig;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  showKeyboardShortcut?: boolean;
  showRelatedFeatures?: boolean;
  showTips?: boolean;
}

interface TooltipManagerProps {
  className?: string;
  showTooltips?: boolean;
  onToggleTooltips?: (show: boolean) => void;
}

// Comprehensive tooltip configurations for the application
export const tooltipConfigs: Record<string, TooltipConfig> = {
  // Dashboard Metrics
  'active-jobs': {
    id: 'active-jobs',
    title: 'Active Jobs',
    description: 'Number of jobs currently in progress across all crews. This includes jobs that are actively being worked on and excludes completed, cancelled, or pending jobs.',
    category: 'metric',
    priority: 'high',
    icon: Clock,
    tips: [
      'High numbers indicate busy periods',
      'Monitor for crew capacity planning',
      'Compare with historical averages'
    ]
  },
  'crew-utilization': {
    id: 'crew-utilization',
    title: 'Crew Utilization',
    description: 'Percentage of available crew time being used productively. Calculated as active work hours divided by total available hours.',
    category: 'metric',
    priority: 'high',
    icon: Users,
    tips: [
      'Optimal range is 75-85%',
      'Above 90% may indicate overwork',
      'Below 60% suggests underutilization'
    ]
  },
  'revenue-tracking': {
    id: 'revenue-tracking',
    title: 'Revenue Tracking',
    description: 'Real-time revenue generated from completed jobs. Updates automatically as jobs are marked complete and invoiced.',
    category: 'metric',
    priority: 'high',
    icon: DollarSign,
    tips: [
      'Includes only invoiced amounts',
      'Excludes pending payments',
      'Updates in real-time'
    ]
  },
  'efficiency-score': {
    id: 'efficiency-score',
    title: 'Efficiency Score',
    description: 'Overall operational efficiency calculated from job completion times, fuel usage, and customer satisfaction metrics.',
    category: 'metric',
    priority: 'medium',
    icon: TrendingUp,
    tips: [
      'Score ranges from 0-100%',
      'Factors in multiple performance metrics',
      'Updates hourly during business hours'
    ]
  },
  
  // Equipment Management
  'equipment-status': {
    id: 'equipment-status',
    title: 'Equipment Status',
    description: 'Current operational status of equipment including active use, maintenance needs, and availability for assignment.',
    category: 'status',
    priority: 'high',
    icon: Wrench,
    tips: [
      'Green: Active and available',
      'Yellow: Maintenance scheduled',
      'Red: Repair needed immediately'
    ]
  },
  'maintenance-schedule': {
    id: 'maintenance-schedule',
    title: 'Maintenance Schedule',
    description: 'Automated scheduling system for preventive maintenance based on usage hours, calendar intervals, and manufacturer recommendations.',
    category: 'feature',
    priority: 'medium',
    icon: Calendar,
    tips: [
      'Prevents unexpected breakdowns',
      'Extends equipment lifespan',
      'Reduces long-term costs'
    ]
  },
  'fuel-tracking': {
    id: 'fuel-tracking',
    title: 'Fuel Tracking',
    description: 'Monitor fuel consumption patterns, costs, and efficiency across all equipment to optimize routes and identify maintenance needs.',
    category: 'metric',
    priority: 'medium',
    icon: Fuel,
    tips: [
      'Track consumption trends',
      'Identify inefficient equipment',
      'Plan fuel budgets accurately'
    ]
  },

  // Weather System
  'weather-alerts': {
    id: 'weather-alerts',
    title: 'Weather Alerts',
    description: 'Real-time weather monitoring system that provides alerts for conditions that may impact outdoor work safety and efficiency.',
    category: 'feature',
    priority: 'high',
    icon: AlertTriangle,
    keyboardShortcut: 'W',
    tips: [
      'Automatically updates every 15 minutes',
      'Includes wind, rain, and temperature alerts',
      'Integrates with crew dispatch system'
    ]
  },
  'weather-override': {
    id: 'weather-override',
    title: 'Weather Override',
    description: 'Allows authorized users to override weather restrictions for urgent jobs while maintaining safety protocols and documentation.',
    category: 'action',
    priority: 'medium',
    icon: Settings,
    tips: [
      'Requires supervisor authorization',
      'Documents override reasons',
      'Maintains safety audit trail'
    ]
  },

  // Route Optimization
  'route-optimization': {
    id: 'route-optimization',
    title: 'Route Optimization',
    description: 'AI-powered system that calculates the most efficient routes considering traffic, job priorities, equipment needs, and crew capabilities.',
    category: 'feature',
    priority: 'high',
    icon: MapPin,
    keyboardShortcut: 'R',
    relatedFeatures: ['crew-tracking', 'fuel-tracking'],
    tips: [
      'Reduces fuel costs by up to 25%',
      'Improves customer satisfaction',
      'Updates routes in real-time'
    ]
  },
  'crew-tracking': {
    id: 'crew-tracking',
    title: 'Crew Tracking',
    description: 'GPS-based real-time location tracking for all crews with privacy controls and emergency response capabilities.',
    category: 'feature',
    priority: 'high',
    icon: MapPin,
    relatedFeatures: ['route-optimization'],
    tips: [
      'Updates location every 30 seconds',
      'Respects privacy settings',
      'Enables emergency response'
    ]
  },

  // Demo Features
  'demo-scenarios': {
    id: 'demo-scenarios',
    title: 'Demo Scenarios',
    description: 'Pre-configured business situations that demonstrate system capabilities under various conditions like emergencies, peak seasons, and growth opportunities.',
    category: 'feature',
    priority: 'medium',
    icon: Target,
    tips: [
      'Reset anytime to normal state',
      'Each scenario tells a story',
      'Shows system adaptability'
    ]
  },
  'real-time-updates': {
    id: 'real-time-updates',
    title: 'Real-time Updates',
    description: 'Live data simulation that shows how metrics change over time, demonstrating the dynamic nature of landscaping operations.',
    category: 'feature',
    priority: 'medium',
    icon: Activity,
    keyboardShortcut: 'Space',
    tips: [
      'Adjustable update frequency',
      'Realistic data variations',
      'Demonstrates system responsiveness'
    ]
  },

  // Navigation
  'dashboard-navigation': {
    id: 'dashboard-navigation',
    title: 'Dashboard Navigation',
    description: 'Quick access to all major system functions including daily operations, strategic planning, and crew management.',
    category: 'navigation',
    priority: 'high',
    icon: BarChart3,
    keyboardShortcut: 'D',
    tips: [
      'Use keyboard shortcuts for speed',
      'Breadcrumbs show current location',
      'Recent items for quick access'
    ]
  },
  'calendar-view': {
    id: 'calendar-view',
    title: 'Strategic Calendar',
    description: 'Long-term planning view showing contracts, seasonal patterns, and resource allocation across months and years.',
    category: 'navigation',
    priority: 'medium',
    icon: Calendar,
    keyboardShortcut: 'C',
    tips: [
      'Switch between month/year views',
      'Color-coded by service type',
      'Drag and drop scheduling'
    ]
  }
};

// Enhanced Tooltip Component
export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  config,
  children,
  className,
  side = 'top',
  align = 'center',
  showKeyboardShortcut = true,
  showRelatedFeatures = true,
  showTips = true
}) => {
  const getCategoryConfig = (category: TooltipConfig['category']) => {
    switch (category) {
      case 'feature':
        return { color: 'text-chart-1', bgColor: 'bg-chart-1/10', label: 'Feature' };
      case 'metric':
        return { color: 'text-chart-2', bgColor: 'bg-chart-2/10', label: 'Metric' };
      case 'action':
        return { color: 'text-chart-3', bgColor: 'bg-chart-3/10', label: 'Action' };
      case 'navigation':
        return { color: 'text-chart-4', bgColor: 'bg-chart-4/10', label: 'Navigation' };
      case 'status':
        return { color: 'text-chart-5', bgColor: 'bg-chart-5/10', label: 'Status' };
    }
  };

  const categoryConfig = getCategoryConfig(config.category);
  const IconComponent = config.icon || Info;

  return (
    <Tooltip>
      <TooltipTrigger asChild className={className}>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side={side} 
        align={align}
        className="bg-popover text-popover-foreground border-border max-w-sm p-4"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-1.5 rounded-md",
              categoryConfig.bgColor
            )}>
              <IconComponent className={cn("w-4 h-4", categoryConfig.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm text-foreground">{config.title}</h4>
                <Badge 
                  className={cn(
                    "text-xs px-1.5 py-0.5",
                    categoryConfig.bgColor,
                    categoryConfig.color
                  )}
                >
                  {categoryConfig.label}
                </Badge>
              </div>
              {showKeyboardShortcut && config.keyboardShortcut && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Shortcut:</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                    {config.keyboardShortcut}
                  </kbd>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {config.description}
          </p>

          {/* Tips */}
          {showTips && config.tips && config.tips.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                <Lightbulb className="w-3 h-3 text-chart-3" />
                Tips
              </div>
              <ul className="space-y-1">
                {config.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-chart-3 mt-1.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Features */}
          {showRelatedFeatures && config.relatedFeatures && config.relatedFeatures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                <Zap className="w-3 h-3 text-chart-1" />
                Related Features
              </div>
              <div className="flex flex-wrap gap-1">
                {config.relatedFeatures.map((featureId) => {
                  const relatedConfig = tooltipConfigs[featureId];
                  return relatedConfig ? (
                    <Badge 
                      key={featureId}
                      className="text-xs px-2 py-0.5 bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      {relatedConfig.title}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

// Tooltip Manager Component
export const TooltipManager: React.FC<TooltipManagerProps> = ({
  className,
  showTooltips = true,
  onToggleTooltips
}) => {
  const [isVisible, setIsVisible] = useState(showTooltips);
  const [helpMode, setHelpMode] = useState(false);

  useEffect(() => {
    setIsVisible(showTooltips);
  }, [showTooltips]);

  const handleToggle = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggleTooltips?.(newState);
  };

  const handleHelpMode = () => {
    setHelpMode(!helpMode);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'h' && event.ctrlKey) {
        event.preventDefault();
        handleToggle();
      }
      if (event.key === '?' && event.shiftKey) {
        event.preventDefault();
        setHelpMode(!helpMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [helpMode]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        size="sm"
        variant={isVisible ? "default" : "outline"}
        onClick={handleToggle}
        className="hover:bg-accent hover:text-accent-foreground"
      >
        {isVisible ? (
          <Eye className="w-4 h-4 mr-2" />
        ) : (
          <EyeOff className="w-4 h-4 mr-2" />
        )}
        <span className="hidden sm:inline">
          {isVisible ? 'Hide' : 'Show'} Tooltips
        </span>
        <span className="sm:hidden">
          Tips
        </span>
      </Button>

      <Button
        size="sm"
        variant={helpMode ? "default" : "outline"}
        onClick={handleHelpMode}
        className="hover:bg-accent hover:text-accent-foreground"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Help Mode</span>
        <span className="sm:hidden">Help</span>
      </Button>

      <AnimatePresence>
        {helpMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 p-3 bg-popover text-popover-foreground border border-border rounded-md shadow-md z-50 min-w-64"
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Keyboard Shortcuts</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Toggle Tooltips</span>
                  <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Ctrl+H</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Help Mode</span>
                  <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Shift+?</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Weather Alerts</span>
                  <kbd className="px-1 py-0.5 bg-muted rounded font-mono">W</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Route Optimization</span>
                  <kbd className="px-1 py-0.5 bg-muted rounded font-mono">R</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Provider wrapper for the entire application
export const EnhancedTooltipProvider: React.FC<{ 
  children: React.ReactNode;
  showTooltips?: boolean;
}> = ({ 
  children, 
  showTooltips = true 
}) => {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      {showTooltips ? children : children}
    </TooltipProvider>
  );
};

// Utility function to create tooltip-wrapped components
export const withTooltip = <P extends object>(
  Component: React.ComponentType<P>,
  tooltipId: string,
  tooltipProps?: Partial<EnhancedTooltipProps>
) => {
  return React.forwardRef<HTMLElement, P>((props, ref) => {
    const config = tooltipConfigs[tooltipId];
    
    if (!config) {
      return <Component {...(props as P)} ref={ref} />;
    }

    return (
      <EnhancedTooltip config={config} {...tooltipProps}>
        <Component {...(props as P)} ref={ref} />
      </EnhancedTooltip>
    );
  });
};

export default EnhancedTooltip;
