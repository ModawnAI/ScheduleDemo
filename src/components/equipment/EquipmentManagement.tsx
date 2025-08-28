"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Wrench,
  Truck,
  Scissors,
  Wind,
  Zap,
  Container,
  Slice,
  Axe,
  Sprout,
  Drill,
  Droplets,
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Calendar,
  Fuel,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Equipment, 
  EquipmentType, 
  EquipmentStatus,
  EquipmentFilter,
  EQUIPMENT_TYPE_CONFIG,
  EQUIPMENT_STATUS_CONFIG 
} from '@/types/equipment';
import { 
  mockEquipment, 
  mockMaintenanceSchedules, 
  mockUtilizationMetrics,
  mockEquipmentAlerts,
  getEquipmentStats,
  getOverdueMaintenanceItems,
  getCriticalAlerts
} from '@/data/mockEquipment';

interface EquipmentManagementProps {
  className?: string;
  showFilters?: boolean;
  compactView?: boolean;
}

// Icon mapping for equipment types
const EquipmentIcons = {
  Wrench,
  Truck,
  Scissors,
  Wind,
  Zap,
  Container,
  Slice,
  Axe,
  Sprout,
  Drill,
  Droplets
};

const EquipmentManagement: React.FC<EquipmentManagementProps> = ({
  className,
  showFilters = true,
  compactView = false
}) => {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(mockEquipment);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCrew, setSelectedCrew] = useState<string>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Equipment statistics
  const stats = getEquipmentStats();
  const overdueItems = getOverdueMaintenanceItems();
  const criticalAlerts = getCriticalAlerts();

  // Filter equipment based on current filters
  useEffect(() => {
    let filtered = equipment;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(eq => 
        eq.name.toLowerCase().includes(query) ||
        eq.type.toLowerCase().includes(query) ||
        eq.manufacturer.toLowerCase().includes(query) ||
        eq.model.toLowerCase().includes(query) ||
        eq.assignedCrewName?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(eq => eq.type === selectedType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(eq => eq.status === selectedStatus);
    }

    // Crew filter
    if (selectedCrew !== 'all') {
      filtered = filtered.filter(eq => eq.assignedCrewId === selectedCrew);
    }

    setFilteredEquipment(filtered);
  }, [equipment, searchQuery, selectedType, selectedStatus, selectedCrew]);

  // Get unique crew options
  const crewOptions = Array.from(new Set(
    equipment
      .filter(eq => eq.assignedCrewId && eq.assignedCrewName)
      .map(eq => ({ id: eq.assignedCrewId!, name: eq.assignedCrewName! }))
  ));

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
      className={cn("space-y-4 md:space-y-6", className)}
    >
      {/* Equipment Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Equipment</CardTitle>
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </div>
              <CardDescription className="text-lg sm:text-2xl font-bold text-foreground">
                {stats.total}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1" />
              </div>
              <CardDescription className="text-lg sm:text-2xl font-bold text-chart-1">
                {stats.active}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Maintenance</CardTitle>
                <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-chart-3" />
              </div>
              <CardDescription className="text-lg sm:text-2xl font-bold text-chart-3">
                {stats.maintenance}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Needs Repair</CardTitle>
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-5" />
              </div>
              <CardDescription className="text-lg sm:text-2xl font-bold text-chart-5">
                {stats.repair}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Avg Utilization</CardTitle>
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-chart-2" />
              </div>
              <CardDescription className="text-lg sm:text-2xl font-bold text-chart-2">
                {stats.averageUtilization}%
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-chart-4" />
              </div>
              <CardDescription className="text-lg sm:text-2xl font-bold text-chart-4">
                ${(stats.totalValue / 1000).toFixed(0)}K
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Alerts Section */}
      {(criticalAlerts.length > 0 || overdueItems.length > 0) && (
        <motion.div variants={itemVariants}>
          <Card className="bg-chart-5/10 border-chart-5/20 border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-chart-5">
                <AlertTriangle className="w-5 h-5" />
                Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Badge className="bg-chart-5 text-primary-foreground w-fit">
                    {criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''}
                  </Badge>
                  <span className="text-sm text-foreground">Safety issues requiring immediate attention</span>
                </div>
              )}
              {overdueItems.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Badge className="bg-chart-3 text-primary-foreground w-fit">
                    {overdueItems.length} Overdue Maintenance
                  </Badge>
                  <span className="text-sm text-foreground">Scheduled maintenance past due date</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search and Filters */}
      {showFilters && (
        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(selectedType !== 'all' || selectedStatus !== 'all' || selectedCrew !== 'all') && (
                    <Badge className="ml-2 bg-chart-1 text-primary-foreground">
                      Active
                    </Badge>
                  )}
                </Button>

                {/* Add Equipment */}
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Equipment</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFiltersPanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Equipment Type</label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="mower">Mowers</SelectItem>
                          <SelectItem value="trimmer">Trimmers</SelectItem>
                          <SelectItem value="blower">Blowers</SelectItem>
                          <SelectItem value="truck">Trucks</SelectItem>
                          <SelectItem value="trailer">Trailers</SelectItem>
                          <SelectItem value="chainsaw">Chainsaws</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="repair">Needs Repair</SelectItem>
                          <SelectItem value="idle">Idle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Assigned Crew</label>
                      <Select value={selectedCrew} onValueChange={setSelectedCrew}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="All crews" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Crews</SelectItem>
                          {crewOptions.map(crew => (
                            <SelectItem key={crew.id} value={crew.id}>
                              {crew.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Equipment Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredEquipment.map((eq) => {
            const typeConfig = EQUIPMENT_TYPE_CONFIG[eq.type];
            const statusConfig = EQUIPMENT_STATUS_CONFIG[eq.status];
            const IconComponent = EquipmentIcons[typeConfig.icon as keyof typeof EquipmentIcons];
            const utilization = mockUtilizationMetrics.find(u => u.equipmentId === eq.id);
            const alerts = mockEquipmentAlerts.filter(a => a.equipmentId === eq.id);
            
            return (
              <motion.div
                key={eq.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
                layout
              >
                <Card className="bg-card text-card-foreground border-border h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-md",
                          typeConfig.bgColor,
                          typeConfig.borderColor,
                          "border"
                        )}>
                          <IconComponent className={cn("w-5 h-5", typeConfig.color)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm font-semibold truncate">
                            {eq.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {eq.manufacturer} {eq.model}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          className={cn(
                            "text-xs",
                            statusConfig.bgColor,
                            statusConfig.color,
                            statusConfig.borderColor,
                            "border"
                          )}
                        >
                          {statusConfig.label}
                        </Badge>
                        {alerts.length > 0 && (
                          <Badge className="bg-chart-5 text-primary-foreground text-xs">
                            {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Assignment Info */}
                    {eq.assignedCrewName && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{eq.assignedCrewName}</span>
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate text-muted-foreground">{eq.location.address}</span>
                    </div>

                    {/* Engine Hours (if applicable) */}
                    {eq.specifications.engineHours !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Engine Hours</span>
                          <span className="font-medium">
                            {eq.specifications.engineHours} / {eq.specifications.maxEngineHours}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-chart-2 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, (eq.specifications.engineHours! / eq.specifications.maxEngineHours!) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Utilization Rate */}
                    {utilization && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Utilization</span>
                          <span className="font-medium text-chart-1">
                            {utilization.utilizationRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-chart-1 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${utilization.utilizationRate}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Maintenance Info */}
                    {eq.nextMaintenanceDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next Service:</span>
                        <span className="font-medium">
                          {new Date(eq.nextMaintenanceDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setSelectedEquipment(eq)}
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-accent hover:text-accent-foreground"
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Service</span>
                        <span className="sm:hidden">Fix</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-accent hover:text-accent-foreground"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Track</span>
                        <span className="sm:hidden">GPS</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredEquipment.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Settings className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Equipment Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                  setSelectedCrew('all');
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EquipmentManagement;
