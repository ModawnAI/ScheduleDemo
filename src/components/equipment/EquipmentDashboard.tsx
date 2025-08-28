"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Activity,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Timer,
  MapPin,
  Users,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Equipment, 
  MaintenanceSchedule, 
  UtilizationMetrics,
  EquipmentAlert,
  EquipmentPerformance,
  MAINTENANCE_PRIORITY_CONFIG 
} from '@/types/equipment';
import { 
  mockEquipment,
  mockMaintenanceSchedules,
  mockUtilizationMetrics,
  mockEquipmentAlerts,
  mockEquipmentPerformance,
  getOverdueMaintenanceItems,
  getUpcomingMaintenanceItems,
  getCriticalAlerts
} from '@/data/mockEquipment';

interface EquipmentDashboardProps {
  className?: string;
  selectedEquipmentId?: string;
  onEquipmentSelect?: (equipmentId: string) => void;
  showCharts?: boolean;
  compactView?: boolean;
}

interface MaintenanceCardProps {
  schedule: MaintenanceSchedule;
  onScheduleUpdate?: (scheduleId: string, status: MaintenanceSchedule['status']) => void;
}

interface UtilizationChartProps {
  metrics: UtilizationMetrics;
  className?: string;
}

interface PerformanceTrendProps {
  performance: EquipmentPerformance;
  className?: string;
}

// Maintenance Schedule Card Component
const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ 
  schedule, 
  onScheduleUpdate 
}) => {
  const priorityConfig = MAINTENANCE_PRIORITY_CONFIG[schedule.priority];
  const isOverdue = schedule.status === 'overdue';
  const isInProgress = schedule.status === 'in-progress';
  const isCompleted = schedule.status === 'completed';

  const getStatusIcon = () => {
    switch (schedule.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case 'in-progress':
        return <Timer className="w-4 h-4 text-chart-3 animate-pulse" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-chart-5" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4 text-chart-2" />;
    }
  };

  const getStatusColor = () => {
    switch (schedule.status) {
      case 'completed':
        return 'text-chart-1';
      case 'in-progress':
        return 'text-chart-3';
      case 'overdue':
        return 'text-chart-5';
      case 'cancelled':
        return 'text-muted-foreground';
      default:
        return 'text-chart-2';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "bg-card text-card-foreground border-border",
        isOverdue && "border-chart-5/50 bg-chart-5/5",
        isCompleted && "border-chart-1/50 bg-chart-1/5"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon()}
                <CardTitle className="text-sm font-semibold truncate">
                  {schedule.title}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                {schedule.equipmentName} • {schedule.type}
              </CardDescription>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge 
                className={cn(
                  "text-xs",
                  priorityConfig.bgColor,
                  priorityConfig.color,
                  priorityConfig.borderColor,
                  "border"
                )}
              >
                {priorityConfig.label}
              </Badge>
              <Badge 
                className={cn(
                  "text-xs",
                  getStatusColor(),
                  isOverdue ? 'bg-chart-5/10 border-chart-5/20' :
                  isCompleted ? 'bg-chart-1/10 border-chart-1/20' :
                  isInProgress ? 'bg-chart-3/10 border-chart-3/20' :
                  'bg-chart-2/10 border-chart-2/20',
                  "border capitalize"
                )}
              >
                {schedule.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
              <span className={cn(
                "font-medium",
                isOverdue ? 'text-chart-5' : 'text-foreground'
              )}>
                {new Date(schedule.scheduledDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium text-foreground">
                {Math.floor(schedule.estimatedDuration / 60)}h {schedule.estimatedDuration % 60}m
              </span>
            </div>
          </div>

          {/* Cost Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Estimated Cost:</span>
            </div>
            <span className="font-medium text-foreground">
              ${schedule.estimatedCost}
            </span>
          </div>

          {/* Technician */}
          {schedule.assignedTechnicianName && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Technician:</span>
              <span className="font-medium text-foreground">
                {schedule.assignedTechnicianName}
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {schedule.description}
          </p>

          {/* Parts Required */}
          {schedule.partsRequired && schedule.partsRequired.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-foreground">Parts Required:</div>
              <div className="space-y-1">
                {schedule.partsRequired.map((part) => (
                  <div key={part.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {part.name} (x{part.quantity})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        ${(part.unitCost * part.quantity).toFixed(2)}
                      </span>
                      {part.inStock ? (
                        <CheckCircle className="w-3 h-3 text-chart-1" />
                      ) : (
                        <XCircle className="w-3 h-3 text-chart-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isCompleted && (
            <div className="flex gap-2 pt-2">
              {schedule.status === 'scheduled' && (
                <Button
                  size="sm"
                  onClick={() => onScheduleUpdate?.(schedule.id, 'in-progress')}
                  className="flex-1 bg-chart-3 text-primary-foreground hover:bg-chart-3/90"
                >
                  <Timer className="w-3 h-3 mr-1" />
                  Start
                </Button>
              )}
              {schedule.status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={() => onScheduleUpdate?.(schedule.id, 'completed')}
                  className="flex-1 bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1 hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="w-3 h-3 mr-1" />
                Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Utilization Chart Component
const UtilizationChart: React.FC<UtilizationChartProps> = ({ 
  metrics, 
  className 
}) => {
  const utilizationColor = metrics.utilizationRate >= 80 ? 'chart-1' : 
                          metrics.utilizationRate >= 60 ? 'chart-3' : 'chart-5';
  
  const efficiencyColor = metrics.efficiency >= 85 ? 'chart-1' : 
                         metrics.efficiency >= 70 ? 'chart-3' : 'chart-5';

  return (
    <div className={cn("space-y-4", className)}>
      {/* Utilization Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Utilization Rate</span>
          <span className={cn("font-bold", `text-${utilizationColor}`)}>
            {metrics.utilizationRate.toFixed(1)}%
          </span>
        </div>
        <Progress 
          value={metrics.utilizationRate} 
          className="h-2"
        />
      </div>

      {/* Efficiency */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Efficiency</span>
          <span className={cn("font-bold", `text-${efficiencyColor}`)}>
            {metrics.efficiency.toFixed(1)}%
          </span>
        </div>
        <Progress 
          value={metrics.efficiency} 
          className="h-2"
        />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Active Hours</div>
          <div className="text-lg font-bold text-chart-1">{metrics.activeHours}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Jobs Completed</div>
          <div className="text-lg font-bold text-chart-2">{metrics.jobsCompleted}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Revenue</div>
          <div className="text-lg font-bold text-chart-3">
            ${(metrics.revenueGenerated / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Profit Margin</div>
          <div className="text-lg font-bold text-chart-4">
            {metrics.profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance Trend Component
const PerformanceTrend: React.FC<PerformanceTrendProps> = ({ 
  performance, 
  className 
}) => {
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="w-3 h-3 text-chart-1" />;
    if (current < previous) return <ArrowDown className="w-3 h-3 text-chart-5" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-chart-1';
    if (current < previous) return 'text-chart-5';
    return 'text-muted-foreground';
  };

  const currentTrend = performance.trends[performance.trends.length - 1];
  const previousTrend = performance.trends[performance.trends.length - 2];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Performance Score */}
      <div className="text-center space-y-2">
        <div className="text-sm text-muted-foreground">Overall Performance</div>
        <div className="text-3xl font-bold text-chart-1">
          {performance.performanceScore}
        </div>
        <div className="text-xs text-muted-foreground">out of 100</div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Reliability</span>
            <span className="font-medium text-foreground">
              {performance.reliabilityScore}%
            </span>
          </div>
          <Progress value={performance.reliabilityScore} className="h-1.5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Efficiency</span>
            <span className="font-medium text-foreground">
              {performance.efficiencyScore}%
            </span>
          </div>
          <Progress value={performance.efficiencyScore} className="h-1.5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cost Effectiveness</span>
            <span className="font-medium text-foreground">
              {performance.costEffectivenessScore}%
            </span>
          </div>
          <Progress value={performance.costEffectivenessScore} className="h-1.5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Utilization</span>
            <span className="font-medium text-foreground">
              {currentTrend?.utilizationRate.toFixed(1)}%
            </span>
          </div>
          <Progress value={currentTrend?.utilizationRate || 0} className="h-1.5" />
        </div>
      </div>

      {/* Trends */}
      {previousTrend && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="text-xs font-medium text-foreground">Recent Trends</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Performance</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(currentTrend.performanceScore, previousTrend.performanceScore)}
                <span className={getTrendColor(currentTrend.performanceScore, previousTrend.performanceScore)}>
                  {Math.abs(currentTrend.performanceScore - previousTrend.performanceScore).toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Maintenance</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(previousTrend.maintenanceCosts, currentTrend.maintenanceCosts)}
                <span className={getTrendColor(previousTrend.maintenanceCosts, currentTrend.maintenanceCosts)}>
                  ${Math.abs(currentTrend.maintenanceCosts - previousTrend.maintenanceCosts).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {performance.recommendations.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="text-xs font-medium text-foreground">Recommendations</div>
          <div className="space-y-1">
            {performance.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <Target className="w-3 h-3 text-chart-2 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Equipment Dashboard Component
const EquipmentDashboard: React.FC<EquipmentDashboardProps> = ({
  className,
  selectedEquipmentId,
  onEquipmentSelect,
  showCharts = true,
  compactView = false
}) => {
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(mockMaintenanceSchedules);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'maintenance' | 'utilization' | 'performance'>('overview');

  const equipment = mockEquipment;
  const utilization = mockUtilizationMetrics;
  const alerts = mockEquipmentAlerts;
  const performance = mockEquipmentPerformance;

  const overdueItems = getOverdueMaintenanceItems();
  const upcomingItems = getUpcomingMaintenanceItems();
  const criticalAlerts = getCriticalAlerts();

  const handleScheduleUpdate = (scheduleId: string, status: MaintenanceSchedule['status']) => {
    setMaintenanceSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, status, completedDate: status === 'completed' ? new Date().toISOString() : undefined }
          : schedule
      )
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4 md:space-y-6", className)}
    >
      {/* Dashboard Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-chart-2" />
                  Equipment Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive equipment management with maintenance and utilization tracking
                </CardDescription>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
                  { id: 'utilization', label: 'Utilization', icon: BarChart3 },
                  { id: 'performance', label: 'Performance', icon: TrendingUp }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      size="sm"
                      variant={selectedTab === tab.id ? "default" : "ghost"}
                      onClick={() => setSelectedTab(tab.id as 'overview' | 'maintenance' | 'utilization' | 'performance')}
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <motion.div variants={itemVariants}>
                <Card className="bg-card text-card-foreground border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Equipment</p>
                        <p className="text-2xl font-bold text-foreground">{equipment.length}</p>
                      </div>
                      <Settings className="w-8 h-8 text-chart-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-card text-card-foreground border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold text-chart-1">
                          {equipment.filter(eq => eq.status === 'active').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-chart-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-card text-card-foreground border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Overdue Maintenance</p>
                        <p className="text-2xl font-bold text-chart-5">{overdueItems.length}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-chart-5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-card text-card-foreground border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Critical Alerts</p>
                        <p className="text-2xl font-bold text-chart-5">{criticalAlerts.length}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-chart-5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Alerts */}
            {alerts.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="bg-card text-card-foreground border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {alerts.slice(0, 3).map(alert => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <AlertTriangle className={cn(
                          "w-4 h-4 mt-0.5",
                          alert.severity === 'critical' ? 'text-chart-5' :
                          alert.severity === 'warning' ? 'text-chart-3' : 'text-chart-2'
                        )} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                          <p className="text-xs text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn(
                              "text-xs",
                              alert.severity === 'critical' ? 'bg-chart-5/10 text-chart-5 border-chart-5/20' :
                              alert.severity === 'warning' ? 'bg-chart-3/10 text-chart-3 border-chart-3/20' :
                              'bg-chart-2/10 text-chart-2 border-chart-2/20',
                              "border"
                            )}>
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {selectedTab === 'maintenance' && (
          <motion.div
            key="maintenance"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            {/* Maintenance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div variants={itemVariants}>
                <Card className="bg-chart-5/5 border-chart-5/20 border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-chart-5">Overdue Items</p>
                        <p className="text-3xl font-bold text-chart-5">{overdueItems.length}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-chart-5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-chart-3/5 border-chart-3/20 border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-chart-3">Upcoming (7 days)</p>
                        <p className="text-3xl font-bold text-chart-3">{upcomingItems.length}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-chart-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-chart-1/5 border-chart-1/20 border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-chart-1">Completed (Month)</p>
                        <p className="text-3xl font-bold text-chart-1">
                          {maintenanceSchedules.filter(s => s.status === 'completed').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-chart-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Maintenance Schedule */}
            <motion.div variants={itemVariants}>
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-chart-3" />
                    Maintenance Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {maintenanceSchedules.map(schedule => (
                      <MaintenanceCard
                        key={schedule.id}
                        schedule={schedule}
                        onScheduleUpdate={handleScheduleUpdate}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {selectedTab === 'utilization' && (
          <motion.div
            key="utilization"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {utilization.map(metrics => (
                <motion.div key={metrics.equipmentId} variants={itemVariants}>
                  <Card className="bg-card text-card-foreground border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{metrics.equipmentName}</CardTitle>
                      <CardDescription>
                        {metrics.period.startDate} - {metrics.period.endDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UtilizationChart metrics={metrics} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === 'performance' && (
          <motion.div
            key="performance"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {performance.map(perf => (
                <motion.div key={perf.equipmentId} variants={itemVariants}>
                  <Card className="bg-card text-card-foreground border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{perf.equipmentName}</CardTitle>
                      <CardDescription>Performance Analysis & Trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PerformanceTrend performance={perf} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EquipmentDashboard;
