"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  CloudRain,
  Wrench,
  FileText,
  Users,
  TrendingUp,
  Zap,
  Clock,
  MapPin,
  DollarSign,
  Settings,
  RotateCcw,
  Play,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

interface ScenarioButtonsProps {
  className?: string;
  onScenarioActivate?: (scenario: DemoScenario) => void;
  onScenarioReset?: () => void;
  currentScenario?: string | null;
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'rush-hour-crisis',
    title: 'Rush Hour Crisis',
    description: 'Multiple urgent jobs appear during peak hours',
    icon: AlertTriangle,
    category: 'crisis',
    impact: 'high',
    duration: '2-3 hours',
    effects: {
      activeJobs: 18,
      crewsActive: 4,
      weatherAlerts: 0,
      efficiency: 65,
      revenue: 4200,
      customerSatisfaction: 78
    },
    narrative: [
      'Emergency call: Tree fell on power lines at Corporate Plaza',
      'Urgent irrigation repair needed at Medical Center',
      'Customer complaint: Missed scheduled service at Residential Complex',
      'All crews dispatched to handle crisis situations'
    ]
  },
  {
    id: 'weather-emergency',
    title: 'Storm System Impact',
    description: 'Severe weather affects all outdoor operations',
    icon: CloudRain,
    category: 'crisis',
    impact: 'high',
    duration: '4-6 hours',
    effects: {
      activeJobs: 6,
      crewsActive: 1,
      weatherAlerts: 3,
      efficiency: 45,
      revenue: 1200,
      customerSatisfaction: 85
    },
    narrative: [
      'Weather Alert: High wind advisory issued for all service areas',
      'Heavy rain expected - outdoor work suspended',
      'Crews recalled to equipment yard for safety',
      'Emergency tree removal requests coming in'
    ]
  },
  {
    id: 'equipment-breakdown',
    title: 'Equipment Breakdown',
    description: 'Major equipment failure requires crew reassignment',
    icon: Wrench,
    category: 'crisis',
    impact: 'medium',
    duration: '1-2 hours',
    effects: {
      activeJobs: 10,
      crewsActive: 3,
      weatherAlerts: 0,
      efficiency: 72,
      revenue: 2400,
      equipmentIssues: 2
    },
    narrative: [
      'Alpha Team mower breakdown at Sunset Plaza',
      'Backup equipment dispatched from equipment yard',
      'Beta Team reassigned to cover Alpha Team routes',
      'Maintenance crew called for emergency repair'
    ]
  },
  {
    id: 'new-contract',
    title: 'Major Contract Win',
    description: 'Large commercial property added to schedule',
    icon: FileText,
    category: 'opportunity',
    impact: 'high',
    duration: 'Ongoing',
    effects: {
      activeJobs: 22,
      crewsActive: 4,
      weatherAlerts: 0,
      efficiency: 92,
      revenue: 6800,
      customerSatisfaction: 96
    },
    narrative: [
      'New Contract: Downtown Business District - $50K annual value',
      'Additional crew members hired for expanded operations',
      'Equipment utilization at peak efficiency',
      'Customer satisfaction scores improving across all properties'
    ]
  },
  {
    id: 'peak-season',
    title: 'Peak Growing Season',
    description: 'High volume landscaping period with increased demand',
    icon: TrendingUp,
    category: 'seasonal',
    impact: 'medium',
    duration: '2-3 months',
    effects: {
      activeJobs: 16,
      crewsActive: 4,
      weatherAlerts: 0,
      efficiency: 88,
      revenue: 4500,
      customerSatisfaction: 91
    },
    narrative: [
      'Spring growth surge - mowing frequency doubled',
      'Fertilization and weed control services in high demand',
      'All crews working extended hours',
      'Revenue 40% above winter baseline'
    ]
  },
  {
    id: 'efficiency-boost',
    title: 'Route Optimization',
    description: 'New routing algorithm improves operational efficiency',
    icon: Zap,
    category: 'opportunity',
    impact: 'medium',
    duration: 'Permanent',
    effects: {
      activeJobs: 14,
      crewsActive: 3,
      weatherAlerts: 0,
      efficiency: 95,
      revenue: 3200,
      customerSatisfaction: 93
    },
    narrative: [
      'AI-powered route optimization deployed',
      'Fuel costs reduced by 25%',
      'Average job completion time improved by 15%',
      'Customer satisfaction up due to reliable scheduling'
    ]
  }
];

const ScenarioButtons: React.FC<ScenarioButtonsProps> = ({
  className,
  onScenarioActivate,
  onScenarioReset,
  currentScenario
}) => {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  const handleScenarioSelect = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
  };

  const handleScenarioActivate = async (scenario: DemoScenario) => {
    setIsActivating(true);
    
    // Simulate activation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onScenarioActivate?.(scenario);
    setIsActivating(false);
  };

  const handleReset = () => {
    setSelectedScenario(null);
    onScenarioReset?.();
  };

  const getCategoryConfig = (category: DemoScenario['category']) => {
    switch (category) {
      case 'crisis':
        return {
          color: 'text-chart-5',
          bgColor: 'bg-chart-5/10',
          borderColor: 'border-chart-5/20',
          label: 'Crisis'
        };
      case 'opportunity':
        return {
          color: 'text-chart-1',
          bgColor: 'bg-chart-1/10',
          borderColor: 'border-chart-1/20',
          label: 'Opportunity'
        };
      case 'seasonal':
        return {
          color: 'text-chart-3',
          bgColor: 'bg-chart-3/10',
          borderColor: 'border-chart-3/20',
          label: 'Seasonal'
        };
      case 'routine':
        return {
          color: 'text-chart-2',
          bgColor: 'bg-chart-2/10',
          borderColor: 'border-chart-2/20',
          label: 'Routine'
        };
    }
  };

  const getImpactConfig = (impact: DemoScenario['impact']) => {
    switch (impact) {
      case 'high':
        return { color: 'text-chart-5', label: 'High Impact' };
      case 'medium':
        return { color: 'text-chart-3', label: 'Medium Impact' };
      case 'low':
        return { color: 'text-chart-2', label: 'Low Impact' };
    }
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-chart-2" />
                  Demo Scenarios
                  {currentScenario && (
                    <Badge className="bg-chart-1 text-primary-foreground">
                      Active
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Pre-configured business situations to demonstrate system capabilities
                </CardDescription>
              </div>

              {currentScenario && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Normal
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Scenario Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {demoScenarios.map((scenario) => {
          const categoryConfig = getCategoryConfig(scenario.category);
          const impactConfig = getImpactConfig(scenario.impact);
          const IconComponent = scenario.icon;
          const isSelected = selectedScenario?.id === scenario.id;
          const isActive = currentScenario === scenario.id;
          
          return (
            <motion.div
              key={scenario.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              layout
            >
              <Card 
                className={cn(
                  "bg-card text-card-foreground border-border h-full cursor-pointer transition-all duration-200",
                  isSelected && "ring-2 ring-chart-2",
                  isActive && "ring-2 ring-chart-1 bg-chart-1/5"
                )}
                onClick={() => handleScenarioSelect(scenario)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-md border",
                        categoryConfig.bgColor,
                        categoryConfig.borderColor
                      )}>
                        <IconComponent className={cn("w-5 h-5", categoryConfig.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold">
                          {scenario.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {scenario.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {isActive && (
                      <CheckCircle className="w-5 h-5 text-chart-1" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      className={cn(
                        "text-xs",
                        categoryConfig.bgColor,
                        categoryConfig.color,
                        categoryConfig.borderColor,
                        "border"
                      )}
                    >
                      {categoryConfig.label}
                    </Badge>
                    <Badge 
                      className={cn(
                        "text-xs",
                        impactConfig.color === 'text-chart-5' ? 'bg-chart-5/10 border-chart-5/20' :
                        impactConfig.color === 'text-chart-3' ? 'bg-chart-3/10 border-chart-3/20' :
                        'bg-chart-2/10 border-chart-2/20',
                        impactConfig.color,
                        "border"
                      )}
                    >
                      {impactConfig.label}
                    </Badge>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{scenario.duration}</span>
                  </div>

                  {/* Key Effects */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Key Effects:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {scenario.effects.activeJobs && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-chart-1" />
                          <span>{scenario.effects.activeJobs} jobs</span>
                        </div>
                      )}
                      {scenario.effects.efficiency && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-chart-2" />
                          <span>{scenario.effects.efficiency}% eff.</span>
                        </div>
                      )}
                      {scenario.effects.revenue && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-chart-3" />
                          <span>${(scenario.effects.revenue / 1000).toFixed(1)}K</span>
                        </div>
                      )}
                      {scenario.effects.weatherAlerts && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-chart-5" />
                          <span>{scenario.effects.weatherAlerts} alerts</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScenarioActivate(scenario);
                    }}
                    disabled={isActivating || isActive}
                    className={cn(
                      "w-full transition-colors duration-200",
                      isActive 
                        ? "bg-chart-1 text-primary-foreground" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {isActivating ? (
                      <>
                        <Settings className="w-4 h-4 mr-2 animate-spin" />
                        Activating...
                      </>
                    ) : isActive ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Active
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Activate Scenario
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Scenario Details */}
      <AnimatePresence>
        {selectedScenario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <selectedScenario.icon className="w-5 h-5 text-chart-2" />
                  {selectedScenario.title} - Scenario Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Scenario Narrative:</div>
                  <div className="space-y-1">
                    {selectedScenario.narrative.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScenarioButtons;
