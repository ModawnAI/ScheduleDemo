"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Fuel,
  Route,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RouteMetrics } from '@/types';
import { 
  calculateRouteEfficiency, 
  compareRouteMetrics, 
  getMetricChangeColor, 
  getMetricChangeBg 
} from '@/lib/routeUtils';

interface MetricItem {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  colorClass: string;
  description?: string;
}

interface MetricsPanelProps {
  className?: string;
  liveMetrics?: RouteMetrics[];
  previousMetrics?: RouteMetrics[];
  isUpdating?: boolean;
  onMetricsUpdate?: (metrics: RouteMetrics[]) => void;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ 
  className, 
  liveMetrics = [], 
  previousMetrics = [], 
  isUpdating = false,
  onMetricsUpdate 
}) => {
  // Calculate aggregated metrics from live data
  const aggregatedMetrics = liveMetrics.length > 0 ? liveMetrics.reduce(
    (acc, metrics) => ({
      driveTime: acc.driveTime + metrics.driveTime,
      billableHours: acc.billableHours + metrics.billableHours,
      totalDistance: (acc.totalDistance || 0) + (metrics.totalDistance || 0),
      fuelCost: (acc.fuelCost || 0) + (metrics.fuelCost || 0)
    }),
    { driveTime: 0, billableHours: 0, totalDistance: 0, fuelCost: 0 }
  ) : null;

  const previousAggregated = previousMetrics.length > 0 ? previousMetrics.reduce(
    (acc, metrics) => ({
      driveTime: acc.driveTime + metrics.driveTime,
      billableHours: acc.billableHours + metrics.billableHours,
      totalDistance: (acc.totalDistance || 0) + (metrics.totalDistance || 0),
      fuelCost: (acc.fuelCost || 0) + (metrics.fuelCost || 0)
    }),
    { driveTime: 0, billableHours: 0, totalDistance: 0, fuelCost: 0 }
  ) : null;

  // Calculate changes if both current and previous metrics exist
  const metricsComparison = aggregatedMetrics && previousAggregated 
    ? compareRouteMetrics(previousAggregated, aggregatedMetrics)
    : null;

  // Calculate overall efficiency
  const overallEfficiency = aggregatedMetrics 
    ? calculateRouteEfficiency(aggregatedMetrics)
    : 0;

  // Dynamic metrics data using live data or fallback to mock
  const dailyMetrics: MetricItem[] = [
    {
      id: 'jobs-completed',
      title: 'Jobs Completed',
      value: liveMetrics.length || 12,
      change: 8.5,
      changeType: 'increase',
      icon: CheckCircle,
      colorClass: 'text-chart-1',
      description: 'Active routes'
    },
    {
      id: 'active-crews',
      title: 'Active Crews',
      value: liveMetrics.filter(m => m.billableHours > 0).length || 4,
      change: 0,
      changeType: 'neutral',
      icon: Users,
      colorClass: 'text-chart-2',
      description: 'Currently working'
    },
    {
      id: 'total-distance',
      title: 'Total Distance',
      value: aggregatedMetrics ? `${aggregatedMetrics.totalDistance?.toFixed(1)}mi` : '142mi',
      change: metricsComparison?.distanceChange || 0,
      changeType: (metricsComparison?.distanceChange || 0) > 0 ? 'increase' : (metricsComparison?.distanceChange || 0) < 0 ? 'decrease' : 'neutral',
      icon: Route,
      colorClass: 'text-chart-3',
      description: 'Route coverage'
    },
    {
      id: 'efficiency',
      title: 'Route Efficiency',
      value: `${overallEfficiency.toFixed(1)}%`,
      change: metricsComparison?.efficiencyChange || -2.1,
      changeType: (metricsComparison?.efficiencyChange || -2.1) > 0 ? 'increase' : 'decrease',
      icon: Target,
      colorClass: 'text-chart-4',
      description: 'Time optimization'
    },
    {
      id: 'fuel-cost',
      title: 'Fuel Cost',
      value: aggregatedMetrics ? `$${aggregatedMetrics.fuelCost?.toFixed(2)}` : '$186',
      change: metricsComparison?.fuelCostChange || -5.2,
      changeType: (metricsComparison?.fuelCostChange || -5.2) > 0 ? 'increase' : 'decrease',
      icon: Fuel,
      colorClass: 'text-chart-5',
      description: 'Daily consumption'
    }
  ];

  const performanceMetrics = [
    {
      id: 'avg-job-time',
      title: 'Avg Job Time',
      value: '2.4h',
      target: '2.5h',
      progress: 96,
      colorClass: 'text-chart-1'
    },
    {
      id: 'customer-satisfaction',
      title: 'Customer Satisfaction',
      value: '4.8/5',
      target: '4.5/5',
      progress: 96,
      colorClass: 'text-chart-2'
    },
    {
      id: 'on-time-completion',
      title: 'On-Time Completion',
      value: '92%',
      target: '90%',
      progress: 92,
      colorClass: 'text-chart-3'
    }
  ];

  // Animation variants following established patterns
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  // Get change styling based on change type
  const getChangeStyling = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return {
          icon: TrendingUp,
          color: 'text-chart-1',
          bg: 'bg-chart-1/10'
        };
      case 'decrease':
        return {
          icon: TrendingDown,
          color: 'text-chart-4',
          bg: 'bg-chart-4/10'
        };
      default:
        return {
          icon: Target,
          color: 'text-muted-foreground',
          bg: 'bg-muted/50'
        };
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4 md:space-y-6", className)}
    >
                {/* Daily Metrics Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Daily Metrics</h3>
              <AnimatePresence>
                {isUpdating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 border border-chart-1/20"
                  >
                    <RefreshCw className="w-3 h-3 text-chart-1 animate-spin" />
                    <span className="text-xs text-chart-1 font-medium">Updating...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {dailyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const changeStyle = getChangeStyling(metric.changeType || 'neutral');
            const ChangeIcon = changeStyle.icon;

            return (
              <motion.div
                key={metric.id}
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${metric.colorClass}`} />
                          <p className="text-sm font-medium text-muted-foreground truncate">
                            {metric.title}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-foreground">
                            {metric.value}
                          </p>
                          {metric.description && (
                            <p className="text-xs text-muted-foreground">
                              {metric.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Change Indicator */}
                      {metric.change !== undefined && metric.change !== 0 && (
                        <motion.div 
                          className={`flex items-center gap-1 px-2 py-1 rounded-md ${getMetricChangeBg(metric.change, metric.id === 'fuel-cost')}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <ChangeIcon className={`w-3 h-3 ${getMetricChangeColor(metric.change, metric.id === 'fuel-cost')}`} />
                          <span className={`text-xs font-medium ${getMetricChangeColor(metric.change, metric.id === 'fuel-cost')}`}>
                            {Math.abs(metric.change).toFixed(1)}
                            {metric.id === 'efficiency' ? '%' : metric.id === 'fuel-cost' ? '' : ''}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Performance Targets</h3>
        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="p-4 space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 ${metric.colorClass}`} />
                    <span className="text-sm font-medium text-foreground">
                      {metric.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {metric.value}
                    </span>
                    <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                      Target: {metric.target}
                    </Badge>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r from-${metric.colorClass.replace('text-', '')} to-${metric.colorClass.replace('text-', '')}/80`}
                      style={{ 
                        background: `hsl(var(--${metric.colorClass.replace('text-', '')}))`,
                        width: `${metric.progress}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className={metric.colorClass}>
                      {metric.progress}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

                {/* Live Route Summary */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Route className="w-5 h-5 text-primary" />
                  Live Route Summary
                </CardTitle>
                <CardDescription>
                  {aggregatedMetrics ? 'Real-time metrics from active routes' : 'Key performance indicators'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <motion.p 
                      className="text-xl font-bold text-chart-1"
                      key={aggregatedMetrics?.billableHours}
                      initial={{ scale: 1.2, color: 'hsl(var(--chart-1))' }}
                      animate={{ scale: 1, color: 'hsl(var(--chart-1))' }}
                      transition={{ duration: 0.3 }}
                    >
                      {aggregatedMetrics ? `${aggregatedMetrics.billableHours.toFixed(1)}h` : '28.5h'}
                    </motion.p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Miles Driven</p>
                    <motion.p 
                      className="text-xl font-bold text-chart-2"
                      key={aggregatedMetrics?.totalDistance}
                      initial={{ scale: 1.2, color: 'hsl(var(--chart-2))' }}
                      animate={{ scale: 1, color: 'hsl(var(--chart-2))' }}
                      transition={{ duration: 0.3 }}
                    >
                      {aggregatedMetrics ? `${aggregatedMetrics.totalDistance?.toFixed(1)}mi` : '142mi'}
                    </motion.p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Drive Time</p>
                    <motion.p 
                      className="text-xl font-bold text-chart-3"
                      key={aggregatedMetrics?.driveTime}
                      initial={{ scale: 1.2, color: 'hsl(var(--chart-3))' }}
                      animate={{ scale: 1, color: 'hsl(var(--chart-3))' }}
                      transition={{ duration: 0.3 }}
                    >
                      {aggregatedMetrics ? `${aggregatedMetrics.driveTime}min` : '142min'}
                    </motion.p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Fuel Cost</p>
                    <div className="flex items-center gap-2">
                      <motion.p 
                        className="text-xl font-bold text-chart-4"
                        key={aggregatedMetrics?.fuelCost}
                        initial={{ scale: 1.2, color: 'hsl(var(--chart-4))' }}
                        animate={{ scale: 1, color: 'hsl(var(--chart-4))' }}
                        transition={{ duration: 0.3 }}
                      >
                        ${aggregatedMetrics ? aggregatedMetrics.fuelCost?.toFixed(2) : '186.50'}
                      </motion.p>
                      <Fuel className="w-4 h-4 text-chart-4" />
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Status Indicator */}
                <AnimatePresence mode="wait">
                  {aggregatedMetrics ? (
                    <motion.div 
                      key="live-status"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 p-3 rounded-md ${
                        overallEfficiency >= 80 
                          ? 'bg-chart-1/10 border border-chart-1/20' 
                          : overallEfficiency >= 60 
                          ? 'bg-chart-3/10 border border-chart-3/20'
                          : 'bg-chart-5/10 border border-chart-5/20'
                      }`}
                    >
                      <Target className={`w-4 h-4 ${
                        overallEfficiency >= 80 ? 'text-chart-1' : 
                        overallEfficiency >= 60 ? 'text-chart-3' : 'text-chart-5'
                      }`} />
                      <p className={`text-sm font-medium ${
                        overallEfficiency >= 80 ? 'text-chart-1' : 
                        overallEfficiency >= 60 ? 'text-chart-3' : 'text-chart-5'
                      }`}>
                        Route efficiency: {overallEfficiency.toFixed(1)}% 
                        {overallEfficiency >= 80 ? ' - Excellent' : 
                         overallEfficiency >= 60 ? ' - Good' : ' - Needs optimization'}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="static-status"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-md bg-chart-1/10 border border-chart-1/20"
                    >
                      <CheckCircle className="w-4 h-4 text-chart-1" />
                      <p className="text-sm text-chart-1 font-medium">
                        All crews performing above target
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
    </motion.div>
  );
};

export default MetricsPanel;
