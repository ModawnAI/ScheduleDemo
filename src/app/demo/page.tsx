"use client";

import React, { useState, useEffect } from 'react';
import AppShell from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  Home,
  Activity,
  Settings,
  BarChart3,
  Zap,
  Target,
  Users,
  Wrench,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import our demo components
import DemoEnhancementPanel from '@/components/demo/DemoEnhancementPanel';
import ScenarioButtons from '@/components/demo/ScenarioButtons';
import { 
  EnhancedTooltipProvider, 
  TooltipManager, 
  EnhancedTooltip,
  tooltipConfigs 
} from '@/components/demo/EnhancedTooltips';
import EquipmentManagement from '@/components/equipment/EquipmentManagement';
import EquipmentDashboard from '@/components/equipment/EquipmentDashboard';

// Types for demo state management
interface DemoState {
  isActive: boolean;
  currentScenario: string | null;
  showTooltips: boolean;
  selectedTab: 'overview' | 'equipment' | 'dashboard' | 'scenarios';
  realTimeMetrics: DemoMetrics;
  equipmentData: EquipmentMetrics;
}

interface DemoMetrics {
  activeJobs: number;
  completedJobs: number;
  crewsActive: number;
  totalRevenue: number;
  efficiency: number;
  weatherAlerts: number;
}

interface EquipmentMetrics {
  totalEquipment: number;
  activeEquipment: number;
  maintenanceNeeded: number;
  fuelLevel: number;
  utilization: number;
}

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'crisis' | 'opportunity' | 'routine' | 'seasonal';
  impact: 'low' | 'medium' | 'high';
  duration: string;
  effects: {
    activeJobs?: number;
    crewsActive?: number;
    weatherAlerts?: number;
    efficiency?: number;
    revenue?: number;
    customerSatisfaction?: number;
    equipmentIssues?: number;
  };
  narrative: string[];
}

export default function DemoPage() {
  const [demoState, setDemoState] = useState<DemoState>({
    isActive: false,
    currentScenario: null,
    showTooltips: true,
    selectedTab: 'overview',
    realTimeMetrics: {
      activeJobs: 0,
      completedJobs: 0,
      crewsActive: 0,
      totalRevenue: 0,
      efficiency: 0,
      weatherAlerts: 0
    },
    equipmentData: {
      totalEquipment: 0,
      activeEquipment: 0,
      maintenanceNeeded: 0,
      fuelLevel: 0,
      utilization: 0
    }
  });

  const [demoMetrics, setDemoMetrics] = useState<DemoMetrics>({
    activeJobs: 12,
    completedJobs: 8,
    crewsActive: 3,
    totalRevenue: 2840,
    efficiency: 87.5,
    weatherAlerts: 1
  });

  // Handle real-time metrics updates
  const handleMetricsUpdate = (metrics: DemoMetrics) => {
    setDemoMetrics({
      activeJobs: metrics.activeJobs,
      completedJobs: metrics.completedJobs,
      crewsActive: metrics.crewsActive,
      totalRevenue: metrics.totalRevenue,
      efficiency: metrics.efficiency,
      weatherAlerts: metrics.weatherAlerts
    });
    
    setDemoState(prev => ({
      ...prev,
      realTimeMetrics: metrics
    }));
  };

  // Handle scenario activation
  const handleScenarioActivate = (scenario: DemoScenario) => {
    setDemoState(prev => ({
      ...prev,
      currentScenario: scenario.id
    }));

    // Apply scenario effects to metrics
    if (scenario.effects) {
      setDemoMetrics(prev => ({
        ...prev,
        ...scenario.effects
      }));
    }
  };

  // Handle scenario reset
  const handleScenarioReset = () => {
    setDemoState(prev => ({
      ...prev,
      currentScenario: null
    }));

    // Reset to baseline metrics
    setDemoMetrics({
      activeJobs: 12,
      completedJobs: 8,
      crewsActive: 3,
      totalRevenue: 2840,
      efficiency: 87.5,
      weatherAlerts: 1
    });
  };

  // Handle tooltip toggle
  const handleTooltipToggle = (show: boolean) => {
    setDemoState(prev => ({
      ...prev,
      showTooltips: show
    }));
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
    <EnhancedTooltipProvider showTooltips={demoState.showTooltips}>
      <AppShell>
        <div className="w-full bg-background text-foreground">
          <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
              
              {/* Breadcrumb Navigation */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Enhanced Demo</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </motion.div>

              {/* Page Header */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-card text-card-foreground border-border">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-2xl sm:text-3xl">
                            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-chart-1" />
                            Enhanced Demo System
                            {demoState.isActive && (
                              <Badge className="bg-chart-1 text-primary-foreground animate-pulse">
                                Live
                              </Badge>
                            )}
                            {demoState.currentScenario && (
                              <Badge className="bg-chart-3 text-primary-foreground">
                                Scenario Active
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-lg">
                            Comprehensive demonstration of real-time updates, equipment management, and interactive scenarios
                          </CardDescription>
                        </div>

                        {/* Demo Controls */}
                        <div className="flex items-center gap-2">
                          <TooltipManager
                            showTooltips={demoState.showTooltips}
                            onToggleTooltips={handleTooltipToggle}
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>

                {/* Live Metrics Overview */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card text-card-foreground border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-chart-2" />
                        Live System Metrics
                        {demoState.isActive && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Settings className="w-4 h-4 text-chart-1" />
                          </motion.div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <EnhancedTooltip config={tooltipConfigs['active-jobs']}>
                          <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-help">
                            <div className="text-2xl font-bold text-chart-1">{demoMetrics.activeJobs}</div>
                            <div className="text-xs text-muted-foreground">Active Jobs</div>
                          </div>
                        </EnhancedTooltip>

                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-chart-2">{demoMetrics.completedJobs}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>

                        <EnhancedTooltip config={tooltipConfigs['crew-utilization']}>
                          <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-help">
                            <div className="text-2xl font-bold text-chart-3">{demoMetrics.crewsActive}</div>
                            <div className="text-xs text-muted-foreground">Active Crews</div>
                          </div>
                        </EnhancedTooltip>

                        <EnhancedTooltip config={tooltipConfigs['revenue-tracking']}>
                          <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-help">
                            <div className="text-2xl font-bold text-chart-4">
                              ${(demoMetrics.totalRevenue / 1000).toFixed(1)}K
                            </div>
                            <div className="text-xs text-muted-foreground">Revenue</div>
                          </div>
                        </EnhancedTooltip>

                        <EnhancedTooltip config={tooltipConfigs['efficiency-score']}>
                          <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-help">
                            <div className="text-2xl font-bold text-chart-5">
                              {demoMetrics.efficiency.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                        </EnhancedTooltip>

                        <EnhancedTooltip config={tooltipConfigs['weather-alerts']}>
                          <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-help">
                            <div className="text-2xl font-bold text-chart-5">{demoMetrics.weatherAlerts}</div>
                            <div className="text-xs text-muted-foreground">Weather Alerts</div>
                          </div>
                        </EnhancedTooltip>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Main Demo Content */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Tabs 
                  value={demoState.selectedTab} 
                  onValueChange={(value) => setDemoState(prev => ({ ...prev, selectedTab: value as 'overview' | 'equipment' | 'dashboard' | 'scenarios' }))}
                  className="space-y-4"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span className="hidden sm:inline">Overview</span>
                      <span className="sm:hidden">Home</span>
                    </TabsTrigger>
                    <TabsTrigger value="equipment" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Equipment</span>
                      <span className="sm:hidden">Equip</span>
                    </TabsTrigger>
                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                      <span className="sm:hidden">Dash</span>
                    </TabsTrigger>
                    <TabsTrigger value="scenarios" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="hidden sm:inline">Scenarios</span>
                      <span className="sm:hidden">Demo</span>
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <TabsContent value="overview" className="space-y-6">
                      <motion.div
                        key="overview"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-6"
                      >
                        {/* Real-time Demo Panel */}
                        <motion.div variants={itemVariants}>
                          <DemoEnhancementPanel
                            onMetricsUpdate={handleMetricsUpdate}
                            updateInterval={3000}
                          />
                        </motion.div>

                        {/* Quick Equipment Overview */}
                        <motion.div variants={itemVariants}>
                          <Card className="bg-card text-card-foreground border-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-chart-3" />
                                Equipment Overview
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <EquipmentManagement 
                                compactView={true}
                                showFilters={false}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="equipment" className="space-y-6">
                      <motion.div
                        key="equipment"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <EquipmentManagement />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="dashboard" className="space-y-6">
                      <motion.div
                        key="dashboard"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <EquipmentDashboard />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="scenarios" className="space-y-6">
                      <motion.div
                        key="scenarios"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <ScenarioButtons
                          onScenarioActivate={handleScenarioActivate}
                          onScenarioReset={handleScenarioReset}
                          currentScenario={demoState.currentScenario}
                        />
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </motion.div>

              {/* Demo Instructions */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-muted/30 border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <HelpCircle className="w-5 h-5 text-chart-2" />
                      Demo Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Getting Started</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Start real-time updates in the Overview tab</li>
                          <li>• Explore equipment management features</li>
                          <li>• Try different demo scenarios</li>
                          <li>• Use tooltips for contextual help</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Keyboard Shortcuts</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+H</kbd> Toggle tooltips</li>
                          <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift+?</kbd> Help mode</li>
                          <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">W</kbd> Weather alerts</li>
                          <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd> Route optimization</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </AppShell>
    </EnhancedTooltipProvider>
  );
}
