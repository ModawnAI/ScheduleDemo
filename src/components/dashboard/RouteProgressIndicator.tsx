"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Route, 
  MapPin, 
  Clock, 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Navigation,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { JobTicket, RouteMetrics } from '@/types';
import { 
  calculateRouteMetrics, 
  calculateRouteEfficiency, 
  calculateHaversineDistance,
  compareRouteMetrics,
  getRouteOptimizationSuggestions,
  getMetricChangeColor,
  getMetricChangeBg
} from '@/lib/routeUtils';

interface RouteProgressIndicatorProps {
  jobs: JobTicket[];
  crewName: string;
  className?: string;
  onOptimize?: (optimizedJobs: JobTicket[]) => void;
  isOptimizing?: boolean;
  previousMetrics?: RouteMetrics;
}

interface ProgressStep {
  id: string;
  label: string;
  distance: number;
  completed: boolean;
  color: string;
}

const RouteProgressIndicator: React.FC<RouteProgressIndicatorProps> = ({
  jobs,
  crewName,
  className,
  onOptimize,
  isOptimizing = false,
  previousMetrics
}) => {
  const [currentMetrics, setCurrentMetrics] = useState<RouteMetrics | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [efficiency, setEfficiency] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Chart colors for progress indicators
  const chartColors = [
    'hsl(var(--chart-1))', // Green
    'hsl(var(--chart-2))', // Blue  
    'hsl(var(--chart-3))', // Yellow
    'hsl(var(--chart-4))', // Orange
    'hsl(var(--chart-5))', // Red
  ];

  const chartColorClasses = [
    'text-chart-1 bg-chart-1/10 border-chart-1/20',
    'text-chart-2 bg-chart-2/10 border-chart-2/20',
    'text-chart-3 bg-chart-3/10 border-chart-3/20',
    'text-chart-4 bg-chart-4/10 border-chart-4/20',
    'text-chart-5 bg-chart-5/10 border-chart-5/20',
  ];

  // Calculate metrics when jobs change
  useEffect(() => {
    if (jobs.length === 0) {
      setCurrentMetrics(null);
      setProgressSteps([]);
      setEfficiency(0);
      setSuggestions([]);
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay for visual feedback
    const timer = setTimeout(() => {
      const metrics = calculateRouteMetrics(jobs);
      const routeEfficiency = calculateRouteEfficiency(metrics);
      const routeSuggestions = getRouteOptimizationSuggestions(jobs, metrics);

      setCurrentMetrics(metrics);
      setEfficiency(routeEfficiency);
      setSuggestions(routeSuggestions);

      // Create progress steps using Haversine calculations
      const steps: ProgressStep[] = [];
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        let distance = 0;

        if (i > 0) {
          distance = calculateHaversineDistance(
            jobs[i - 1].lat, jobs[i - 1].long,
            job.lat, job.long
          );
        }

        steps.push({
          id: job.id,
          label: job.task.substring(0, 30) + (job.task.length > 30 ? '...' : ''),
          distance,
          completed: job.status === 'completed',
          color: chartColors[i % chartColors.length]
        });
      }

      setProgressSteps(steps);
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [jobs]);

  // Animation variants
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: { width: '100%' }
  };

  // Get efficiency color based on score
  const getEfficiencyColor = (score: number): string => {
    if (score >= 85) return 'text-chart-1 bg-chart-1/10';
    if (score >= 70) return 'text-chart-2 bg-chart-2/10';
    if (score >= 55) return 'text-chart-3 bg-chart-3/10';
    if (score >= 40) return 'text-chart-4 bg-chart-4/10';
    return 'text-chart-5 bg-chart-5/10';
  };

  // Calculate metrics comparison if previous metrics available
  const metricsComparison = previousMetrics && currentMetrics 
    ? compareRouteMetrics(previousMetrics, currentMetrics)
    : null;

  if (jobs.length === 0) {
    return (
      <Card className={cn("bg-card text-card-foreground border-border", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <Route className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No jobs assigned to {crewName}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Route Progress - {crewName}
            </div>
            {onOptimize && (
              <Button
                onClick={() => onOptimize(jobs)}
                disabled={isOptimizing || isCalculating}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Optimize
                  </>
                )}
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Real-time route metrics with Haversine distance calculations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loading State */}
          <AnimatePresence>
            {isCalculating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: chartColors[i],
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Calculating route metrics...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metrics Summary */}
          {currentMetrics && !isCalculating && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Clock,
                  label: 'Drive Time',
                  value: `${currentMetrics.driveTime}min`,
                  change: metricsComparison?.driveTimeChange,
                  colorClass: 'text-chart-1'
                },
                {
                  icon: Route,
                  label: 'Distance',
                  value: `${currentMetrics.totalDistance}mi`,
                  change: metricsComparison?.distanceChange,
                  colorClass: 'text-chart-2'
                },
                {
                  icon: Fuel,
                  label: 'Fuel Cost',
                  value: `$${currentMetrics.fuelCost}`,
                  change: metricsComparison?.fuelCostChange,
                  colorClass: 'text-chart-3'
                },
                {
                  icon: Target,
                  label: 'Efficiency',
                  value: `${efficiency}%`,
                  change: metricsComparison?.efficiencyChange,
                  colorClass: getEfficiencyColor(efficiency).split(' ')[0]
                }
              ].map((metric, index) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`w-4 h-4 ${metric.colorClass}`} />
                    <span className="text-sm font-medium text-foreground">
                      {metric.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground">
                      {metric.value}
                    </p>
                    {metric.change !== undefined && metric.change !== 0 && (
                      <div className="flex items-center gap-1">
                        {metric.change > 0 ? (
                          <TrendingUp className="w-3 h-3 text-chart-4" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-chart-1" />
                        )}
                        <span className={`text-xs font-medium ${
                          metric.change > 0 ? 'text-chart-4' : 'text-chart-1'
                        }`}>
                          {Math.abs(metric.change).toFixed(1)}
                          {metric.label === 'Efficiency' ? '%' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Route Progress Steps */}
          {progressSteps.length > 0 && !isCalculating && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Navigation className="w-4 h-4 text-muted-foreground" />
                Route Sequence
              </h4>
              
              <div className="space-y-3">
                {progressSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    variants={itemVariants}
                    className="flex items-center gap-3"
                  >
                    {/* Step Number */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2"
                      style={{ 
                        backgroundColor: step.completed ? step.color : 'transparent',
                        borderColor: step.color,
                        color: step.completed ? 'white' : step.color
                      }}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {step.label}
                        </p>
                        {step.distance > 0 && (
                          <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                            {step.distance.toFixed(1)}mi
                          </Badge>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-1 w-full bg-muted rounded-full h-1.5">
                        <motion.div
                          variants={progressVariants}
                          className="h-1.5 rounded-full"
                          style={{ 
                            backgroundColor: step.color,
                            width: step.completed ? '100%' : '0%'
                          }}
                          initial="hidden"
                          animate={step.completed ? "visible" : "hidden"}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Connection Line */}
                    {index < progressSteps.length - 1 && (
                      <div className="absolute left-4 mt-8 w-0.5 h-6 bg-border" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Optimization Suggestions */}
          {suggestions.length > 0 && !isCalculating && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-chart-3" />
                Optimization Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border ${chartColorClasses[index % chartColorClasses.length]}`}
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Efficiency Score */}
          {!isCalculating && (
            <motion.div variants={itemVariants}>
              <div className={`p-4 rounded-lg border ${getEfficiencyColor(efficiency)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Route Efficiency</span>
                  </div>
                  <span className="text-2xl font-bold">{efficiency}%</span>
                </div>
                <div className="mt-2 w-full bg-muted/30 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: 'currentColor' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${efficiency}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RouteProgressIndicator;
