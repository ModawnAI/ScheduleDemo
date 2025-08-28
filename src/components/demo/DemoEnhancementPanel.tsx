"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play,
  Pause,
  RotateCcw,
  Activity,
  Users,
  MapPin,
  Clock,
  Fuel,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RealTimeMetrics {
  timestamp: string;
  activeJobs: number;
  completedJobs: number;
  crewsActive: number;
  crewsIdle: number;
  totalRevenue: number;
  fuelCost: number;
  efficiency: number;
  customerSatisfaction: number;
  equipmentUtilization: number;
  weatherAlerts: number;
}

interface CrewLocation {
  crewId: string;
  crewName: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle' | 'maintenance' | 'emergency';
  currentJob?: string;
  eta?: string;
}

interface JobUpdate {
  jobId: string;
  clientName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  estimatedCompletion?: string;
  crewAssigned?: string;
}

interface DemoEnhancementPanelProps {
  className?: string;
  onMetricsUpdate?: (metrics: RealTimeMetrics) => void;
  onCrewLocationUpdate?: (locations: CrewLocation[]) => void;
  onJobStatusUpdate?: (jobs: JobUpdate[]) => void;
  updateInterval?: number; // in milliseconds
}

const DemoEnhancementPanel: React.FC<DemoEnhancementPanelProps> = ({
  className,
  onMetricsUpdate,
  onCrewLocationUpdate,
  onJobStatusUpdate,
  updateInterval = 3000
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<RealTimeMetrics | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x speed
  const [autoScenarios, setAutoScenarios] = useState(false);

  // Base metrics for simulation
  const baseMetrics: RealTimeMetrics = {
    timestamp: new Date().toISOString(),
    activeJobs: 12,
    completedJobs: 8,
    crewsActive: 3,
    crewsIdle: 1,
    totalRevenue: 2840,
    fuelCost: 320,
    efficiency: 87.5,
    customerSatisfaction: 94.2,
    equipmentUtilization: 78.3,
    weatherAlerts: 1
  };

  // Generate realistic metric variations
  const generateMetricUpdate = useCallback((previous: RealTimeMetrics): RealTimeMetrics => {
    const variation = (base: number, range: number) => {
      const change = (Math.random() - 0.5) * range;
      return Math.max(0, base + change);
    };

    const timeVariation = (base: number, trend: number) => {
      // Add slight upward trend over time with random variation
      const trendFactor = trend * (updateCount * 0.01);
      const randomFactor = (Math.random() - 0.5) * 2;
      return Math.max(0, base + trendFactor + randomFactor);
    };

    return {
      timestamp: new Date().toISOString(),
      activeJobs: Math.round(timeVariation(previous.activeJobs, 0.1)),
      completedJobs: Math.round(timeVariation(previous.completedJobs, 0.2)),
      crewsActive: Math.min(4, Math.max(1, Math.round(variation(previous.crewsActive, 0.5)))),
      crewsIdle: Math.max(0, 4 - Math.round(variation(previous.crewsActive, 0.5))),
      totalRevenue: Math.round(timeVariation(previous.totalRevenue, 15)),
      fuelCost: Math.round(variation(previous.fuelCost, 20)),
      efficiency: Math.min(100, Math.max(70, variation(previous.efficiency, 3))),
      customerSatisfaction: Math.min(100, Math.max(85, variation(previous.customerSatisfaction, 2))),
      equipmentUtilization: Math.min(100, Math.max(60, variation(previous.equipmentUtilization, 4))),
      weatherAlerts: Math.max(0, Math.round(variation(previous.weatherAlerts, 1)))
    };
  }, [updateCount]);

  // Generate crew location updates
  const generateCrewLocations = useCallback((): CrewLocation[] => {
    const baseLocations = [
      { crewId: 'crew-001', crewName: 'Alpha Team', baseLat: 34.0522, baseLng: -118.2437 },
      { crewId: 'crew-002', crewName: 'Beta Team', baseLat: 34.0928, baseLng: -118.3287 },
      { crewId: 'crew-003', crewName: 'Gamma Team', baseLat: 34.1478, baseLng: -118.1445 },
      { crewId: 'crew-004', crewName: 'Delta Team', baseLat: 34.0194, baseLng: -118.4912 }
    ];

    return baseLocations.map(base => {
      // Simulate movement within a small radius
      const radius = 0.01; // ~1km radius
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      return {
        ...base,
        lat: base.baseLat + (distance * Math.cos(angle)),
        lng: base.baseLng + (distance * Math.sin(angle)),
        status: Math.random() > 0.8 ? 'idle' : 'active' as 'active' | 'idle',
        currentJob: Math.random() > 0.3 ? `Job ${Math.floor(Math.random() * 20) + 1}` : undefined,
        eta: Math.random() > 0.5 ? `${Math.floor(Math.random() * 45) + 15} min` : undefined
      };
    });
  }, []);

  // Generate job status updates
  const generateJobUpdates = useCallback((): JobUpdate[] => {
    const jobStatuses: JobUpdate['status'][] = ['pending', 'in-progress', 'completed'];
    const clients = [
      'Sunset Plaza', 'Medical Center', 'Corporate Plaza', 'Residential Complex',
      'Shopping Center', 'University Campus', 'City Park', 'Business District'
    ];

    return Array.from({ length: 8 }, (_, i) => ({
      jobId: `job-${String(i + 1).padStart(3, '0')}`,
      clientName: clients[i % clients.length],
      status: jobStatuses[Math.floor(Math.random() * jobStatuses.length)],
      progress: Math.floor(Math.random() * 100),
      estimatedCompletion: Math.random() > 0.5 ? 
        new Date(Date.now() + Math.random() * 4 * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : undefined,
      crewAssigned: Math.random() > 0.2 ? 
        ['Alpha Team', 'Beta Team', 'Gamma Team', 'Delta Team'][Math.floor(Math.random() * 4)] : undefined
    }));
  }, []);

  // Real-time update effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        const newMetrics = currentMetrics ? 
          generateMetricUpdate(currentMetrics) : 
          { ...baseMetrics, timestamp: new Date().toISOString() };
        
        setCurrentMetrics(newMetrics);
        setUpdateCount(prev => prev + 1);
        setLastUpdateTime(new Date());

        // Trigger callbacks
        onMetricsUpdate?.(newMetrics);
        onCrewLocationUpdate?.(generateCrewLocations());
        onJobStatusUpdate?.(generateJobUpdates());
      }, updateInterval / simulationSpeed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    isActive, 
    currentMetrics, 
    generateMetricUpdate, 
    generateCrewLocations, 
    generateJobUpdates,
    onMetricsUpdate, 
    onCrewLocationUpdate, 
    onJobStatusUpdate,
    updateInterval,
    simulationSpeed
  ]);

  // Initialize with base metrics
  useEffect(() => {
    if (!currentMetrics) {
      setCurrentMetrics({ ...baseMetrics });
    }
  }, [currentMetrics, baseMetrics]);

  const handleStart = () => {
    setIsActive(true);
    if (!currentMetrics) {
      setCurrentMetrics({ ...baseMetrics });
    }
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentMetrics({ ...baseMetrics, timestamp: new Date().toISOString() });
    setUpdateCount(0);
    setLastUpdateTime(null);
  };

  const getMetricTrend = (current: number, base: number) => {
    const diff = current - base;
    const percentage = Math.abs((diff / base) * 100);
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
      percentage: percentage.toFixed(1)
    };
  };

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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1]
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      {/* Control Panel */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-chart-1" />
                  Real-Time Demo Control
                  {isActive && (
                    <motion.div
                      variants={pulseVariants}
                      animate="pulse"
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Badge className="bg-chart-1 text-primary-foreground">
                        Live
                      </Badge>
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription>
                  Simulate real-time data updates for enhanced demo experience
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleStart}
                  disabled={isActive}
                  className="bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isActive}
                  variant="outline"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Simulation Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Simulation Speed</Label>
                <div className="flex gap-2">
                  {[1, 2, 5].map(speed => (
                    <Button
                      key={speed}
                      size="sm"
                      variant={simulationSpeed === speed ? "default" : "outline"}
                      onClick={() => setSimulationSpeed(speed)}
                      className="flex-1"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-scenarios"
                  checked={autoScenarios}
                  onCheckedChange={setAutoScenarios}
                />
                <Label htmlFor="auto-scenarios" className="text-sm">
                  Auto Scenarios
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Update Frequency</Label>
                <div className="text-sm text-muted-foreground">
                  Every {(updateInterval / simulationSpeed / 1000).toFixed(1)}s
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <RefreshCw className="w-3 h-3" />
                  Updates
                </div>
                <div className="text-lg font-bold text-chart-1">{updateCount}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Timer className="w-3 h-3" />
                  Last Update
                </div>
                <div className="text-sm font-medium text-foreground">
                  {lastUpdateTime ? lastUpdateTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  }) : 'Never'}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  Speed
                </div>
                <div className="text-lg font-bold text-chart-3">{simulationSpeed}x</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  Status
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  isActive ? "text-chart-1" : "text-muted-foreground"
                )}>
                  {isActive ? 'Running' : 'Stopped'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Live Metrics Display */}
      {currentMetrics && (
        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-chart-2" />
                Live Metrics
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4 text-chart-1" />
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Active Jobs */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-chart-1" />
                    <span className="text-sm font-medium">Active Jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-chart-1">
                      {currentMetrics.activeJobs}
                    </span>
                    {(() => {
                      const trend = getMetricTrend(currentMetrics.activeJobs, baseMetrics.activeJobs);
                      return trend.direction !== 'neutral' && (
                        <div className={cn(
                          "flex items-center gap-1 text-xs",
                          trend.direction === 'up' ? 'text-chart-1' : 'text-chart-5'
                        )}>
                          {trend.direction === 'up' ? 
                            <TrendingUp className="w-3 h-3" /> : 
                            <TrendingDown className="w-3 h-3" />
                          }
                          {trend.percentage}%
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Crews Active */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-chart-2" />
                    <span className="text-sm font-medium">Active Crews</span>
                  </div>
                  <div className="text-2xl font-bold text-chart-2">
                    {currentMetrics.crewsActive}/{currentMetrics.crewsActive + currentMetrics.crewsIdle}
                  </div>
                </div>

                {/* Revenue */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-chart-3" />
                    <span className="text-sm font-medium">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-chart-3">
                      ${(currentMetrics.totalRevenue / 1000).toFixed(1)}K
                    </span>
                    {(() => {
                      const trend = getMetricTrend(currentMetrics.totalRevenue, baseMetrics.totalRevenue);
                      return trend.direction !== 'neutral' && (
                        <div className={cn(
                          "flex items-center gap-1 text-xs",
                          trend.direction === 'up' ? 'text-chart-1' : 'text-chart-5'
                        )}>
                          {trend.direction === 'up' ? 
                            <TrendingUp className="w-3 h-3" /> : 
                            <TrendingDown className="w-3 h-3" />
                          }
                          {trend.percentage}%
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Efficiency */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-chart-4" />
                    <span className="text-sm font-medium">Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-chart-4">
                    {currentMetrics.efficiency.toFixed(1)}%
                  </div>
                </div>

                {/* Weather Alerts */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-chart-5" />
                    <span className="text-sm font-medium">Alerts</span>
                  </div>
                  <div className="text-2xl font-bold text-chart-5">
                    {currentMetrics.weatherAlerts}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DemoEnhancementPanel;
