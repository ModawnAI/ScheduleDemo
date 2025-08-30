"use client";

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays, Grid3X3, Calendar as CalendarIcon } from 'lucide-react';
import { mockContracts } from '@/data/mockData';
import { Contract, ServiceType } from '@/types';
import { DayButton } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendar } from '@/contexts/CalendarContext';

type ViewMode = 'yearly' | 'monthly';

interface StrategicCalendarProps {
  className?: string;
}

interface ServiceEvent {
  date: Date;
  serviceType: ServiceType;
  clientName: string;
  contractId: string;
}

const StrategicCalendar: React.FC<StrategicCalendarProps> = ({ className = "" }) => {
  // Use calendar context for state management
  const { navigateToDate } = useCalendar();

  // Local state for component-specific functionality
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<Set<ServiceType>>(new Set());

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
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
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

  // Generate service events from contracts with intelligent distribution
  const generateServiceEvents = (): ServiceEvent[] => {
    const events: ServiceEvent[] = [];
    const currentYear = new Date().getFullYear();
    
    mockContracts.forEach((contract: Contract) => {
      contract.services.forEach(service => {
        // Convert month name to number
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = monthNames.indexOf(service.month);
        
        if (monthIndex !== -1) {
          const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
          
          // Intelligent service distribution based on service type
          if (service.serviceType.includes('Weekly')) {
            // Weekly services: distribute every 7 days starting from a random day 1-7
            const startDay = Math.floor(Math.random() * 7) + 1;
            for (let week = 0; week < 4; week++) {
              const dayOfMonth = Math.min(startDay + (week * 7), daysInMonth);
              if (dayOfMonth <= daysInMonth) {
                events.push({
                  date: new Date(currentYear, monthIndex, dayOfMonth),
                  serviceType: service.serviceType,
                  clientName: contract.clientName,
                  contractId: contract.id
                });
              }
            }
          } else if (service.serviceType.includes('Bi-weekly')) {
            // Bi-weekly services: distribute every 14 days
            const startDay = Math.floor(Math.random() * 14) + 1;
            for (let period = 0; period < 2; period++) {
              const dayOfMonth = Math.min(startDay + (period * 14), daysInMonth);
              if (dayOfMonth <= daysInMonth) {
                events.push({
                  date: new Date(currentYear, monthIndex, dayOfMonth),
                  serviceType: service.serviceType,
                  clientName: contract.clientName,
                  contractId: contract.id
                });
              }
            }
          } else {
            // Other services: distribute evenly with slight randomization
            const interval = Math.floor(daysInMonth / service.frequency);
            for (let i = 0; i < service.frequency; i++) {
              // Add slight randomization while avoiding weekends for most services
              let dayOfMonth = 1 + (i * interval) + Math.floor(Math.random() * 3);
              const testDate = new Date(currentYear, monthIndex, dayOfMonth);
              
              // Avoid Sundays for most commercial services
              if (testDate.getDay() === 0 && !service.serviceType.includes('Cleanup')) {
                dayOfMonth = Math.min(dayOfMonth + 1, daysInMonth);
              }
              
              dayOfMonth = Math.min(dayOfMonth, daysInMonth);
              events.push({
                date: new Date(currentYear, monthIndex, dayOfMonth),
                serviceType: service.serviceType,
                clientName: contract.clientName,
                contractId: contract.id
              });
            }
          }
        }
      });
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const serviceEvents = generateServiceEvents();

  // Get service type color based on CPM AI brand theme
  const getServiceTypeColor = (serviceType: ServiceType): string => {
    // Map service types to brand colors using CSS variables for theme consistency
    const colorMap: Record<ServiceType, string> = {
      // Primary services - Main green palette
      'Weekly Mowing': 'bg-primary text-primary-foreground', // Primary green for core mowing
      'Bi-weekly Mowing': 'bg-chart-3 text-primary-foreground', // Slightly darker green
      
      // Maintenance services - Secondary green palette  
      'Fertilization': 'bg-chart-2 text-primary-foreground', // Medium green for growth
      'Irrigation Check': 'bg-chart-1 text-primary-foreground', // Light green for water
      
      // Seasonal services - Accent colors
      'Monthly Cleanup': 'bg-secondary text-secondary-foreground', // Light green for cleanup
      'Leaf Removal': 'bg-accent text-accent-foreground', // Accent green for seasonal
      'Hedge Trimming': 'bg-chart-4 text-primary-foreground', // Dark green for precision work
      'Mulch Installation': 'bg-chart-5 text-primary-foreground', // Darkest green for installation
      
      // Tree and Plant services
      'Tree Pruning': 'bg-green-700 text-white',
      'Plant Installation': 'bg-green-600 text-white',
      
      // Hardscape services
      'Hardscape Installation': 'bg-stone-600 text-white',
      'Patio Installation': 'bg-stone-700 text-white',
      'Retaining Wall': 'bg-stone-800 text-white',
      
      // Seasonal and specialty services
      'Seasonal Color Change': 'bg-orange-500 text-white',
      'Holiday Lighting': 'bg-yellow-600 text-white',
      'Snow Removal': 'bg-blue-600 text-white',
      
      // Treatment services
      'Pest Control Treatment': 'bg-red-600 text-white',
      'Soil Amendment': 'bg-amber-700 text-white',
      'Aeration & Overseeding': 'bg-lime-600 text-white',
      
      // Repair and maintenance
      'Irrigation Repair': 'bg-blue-700 text-white',
      'Drainage Solutions': 'bg-cyan-700 text-white',
      
      // Design services
      'Landscape Design': 'bg-purple-600 text-white',
      'Sod Installation': 'bg-emerald-600 text-white'
    };
    return colorMap[serviceType] || 'bg-muted text-muted-foreground';
  };

  // Get background color class for service dots/indicators
  const getServiceDotColor = (serviceType: ServiceType): string => {
    const colorMap: Record<ServiceType, string> = {
      'Weekly Mowing': 'bg-primary',
      'Bi-weekly Mowing': 'bg-chart-3',
      'Fertilization': 'bg-chart-2', 
      'Irrigation Check': 'bg-chart-1',
      'Monthly Cleanup': 'bg-secondary',
      'Leaf Removal': 'bg-accent',
      'Hedge Trimming': 'bg-chart-4',
      'Mulch Installation': 'bg-chart-5',
      'Tree Pruning': 'bg-green-700',
      'Plant Installation': 'bg-green-600',
      'Hardscape Installation': 'bg-stone-600',
      'Patio Installation': 'bg-stone-700',
      'Retaining Wall': 'bg-stone-800',
      'Seasonal Color Change': 'bg-orange-500',
      'Holiday Lighting': 'bg-yellow-600',
      'Snow Removal': 'bg-blue-600',
      'Pest Control Treatment': 'bg-red-600',
      'Soil Amendment': 'bg-amber-700',
      'Aeration & Overseeding': 'bg-lime-600',
      'Irrigation Repair': 'bg-blue-700',
      'Drainage Solutions': 'bg-cyan-700',
      'Landscape Design': 'bg-purple-600',
      'Sod Installation': 'bg-emerald-600'
    };
    return colorMap[serviceType] || 'bg-muted';
  };

  // Get events for a specific date with optional filtering
  const getEventsForDate = (date: Date): ServiceEvent[] => {
    let events = serviceEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
    
    // Apply service type filter if any are selected
    if (filteredServiceTypes.size > 0) {
      events = events.filter(event => filteredServiceTypes.has(event.serviceType));
    }
    
    return events;
  };

  // Handle service type filter toggle
  const toggleServiceTypeFilter = (serviceType: ServiceType) => {
    const newFilters = new Set(filteredServiceTypes);
    if (newFilters.has(serviceType)) {
      newFilters.delete(serviceType);
    } else {
      newFilters.add(serviceType);
    }
    setFilteredServiceTypes(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilteredServiceTypes(new Set());
  };

  // Custom day button renderer with enhanced interactive states
  const CustomDayButton = ({ day, ...props }: React.ComponentProps<typeof DayButton>) => {
    const events = getEventsForDate(day.date);
    const dayNumber = day.date.getDate();
    const isSelected = selectedDate?.toDateString() === day.date.toDateString();
    const isToday = new Date().toDateString() === day.date.toDateString();
    
    // Enhanced click handler with visual feedback
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent default to avoid any conflicts
      e.preventDefault();
      
      // Set the selected date with smooth state transition
      setSelectedDate(day.date);
      
      // Optional: Add haptic feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    };

    // Determine button styling based on state
    const getButtonClasses = () => {
      const baseClasses = "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none relative transition-all duration-200 transform";
      
      if (isSelected) {
        // Selected state - primary theme colors
        return `${baseClasses} bg-primary text-primary-foreground shadow-md scale-105 hover:bg-primary/90`;
      } else if (isToday) {
        // Today's date - accent colors with subtle highlight
        return `${baseClasses} bg-accent text-accent-foreground border-2 border-primary/30 hover:bg-accent/80 hover:border-primary/50`;
      } else if (events.length > 0) {
        // Days with services - subtle background with hover effects
        return `${baseClasses} bg-secondary/30 hover:bg-accent hover:text-accent-foreground hover:scale-102`;
      } else {
        // Regular days - standard hover effects
        return `${baseClasses} hover:bg-accent hover:text-accent-foreground hover:scale-102`;
      }
    };

    // Render day without tooltip if no events
    if (events.length === 0) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className={getButtonClasses()}
          onClick={handleClick}
          {...props}
        >
          <span className={`text-xs font-medium ${isSelected ? 'font-bold' : ''}`}>
            {dayNumber}
          </span>
          {isToday && !isSelected && (
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
          )}
        </Button>
      );
    }

    // Render day with tooltip for days with events
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={getButtonClasses()}
              onClick={handleClick}
              {...props}
            >
              <span className={`text-xs font-medium ${isSelected ? 'font-bold' : ''}`}>
                {dayNumber}
              </span>
              
              {/* Service dots */}
              <div className="flex gap-0.5 flex-wrap justify-center absolute bottom-0.5">
                {events.slice(0, 3).map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-1.5 h-1.5 rounded-full ${getServiceDotColor(event.serviceType)} shadow-sm ${
                      isSelected ? 'ring-1 ring-primary-foreground/30' : ''
                    }`}
                  />
                ))}
                {events.length > 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`w-1.5 h-1.5 rounded-full bg-muted-foreground shadow-sm ${
                      isSelected ? 'ring-1 ring-primary-foreground/30' : ''
                    }`}
                  />
                )}
              </div>

              {/* Today indicator */}
              {isToday && !isSelected && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium text-popover-foreground">
                {events.length} service{events.length > 1 ? 's' : ''} scheduled
                {isToday && <span className="text-primary"> (Today)</span>}
                {isSelected && <span className="text-primary"> (Selected)</span>}
              </p>
              {events.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${getServiceDotColor(event.serviceType)}`} />
                  <span className="text-popover-foreground">
                    {event.serviceType} - {event.clientName}
                  </span>
                </div>
              ))}
              {events.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{events.length - 3} more service{events.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Strategic Calendar
            </CardTitle>
            <CardDescription>
              Yearly and monthly view of all scheduled services
            </CardDescription>
          </div>
          
          {/* Enhanced View Toggle with Interactive States */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-2 transition-all duration-200 ${
                viewMode === 'monthly' 
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
                  : 'hover:bg-accent hover:text-accent-foreground hover:scale-102'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Monthly
            </Button>
            <Button
              variant={viewMode === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('yearly')}
              className={`flex items-center gap-2 transition-all duration-200 ${
                viewMode === 'yearly' 
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
                  : 'hover:bg-accent hover:text-accent-foreground hover:scale-102'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          {viewMode === 'monthly' ? (
            <motion.div 
              key="monthly"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Monthly Calendar View */}
              <motion.div variants={itemVariants} className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      // Navigate to daily view with selected date
                      const dateString = date.toISOString().split('T')[0];
                      navigateToDate(dateString);
                    }
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  components={{
                    DayButton: CustomDayButton
                  }}
                />
              </motion.div>

              {/* Interactive Service Type Legend with Filtering */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Service Types</h4>
                  {filteredServiceTypes.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      Clear filters ({filteredServiceTypes.size})
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Weekly Mowing', 'Bi-weekly Mowing', 'Fertilization', 'Irrigation Check',
                    'Monthly Cleanup', 'Leaf Removal', 'Hedge Trimming', 'Mulch Installation'
                  ].map((serviceType) => {
                    const isFiltered = filteredServiceTypes.has(serviceType as ServiceType);
                    return (
                      <TooltipProvider key={serviceType}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleServiceTypeFilter(serviceType as ServiceType)}
                              className={`flex items-center gap-2 p-2 h-auto justify-start transition-all duration-200 ${
                                isFiltered
                                  ? 'bg-primary text-primary-foreground shadow-sm scale-102 hover:bg-primary/90'
                                  : 'hover:bg-accent hover:text-accent-foreground hover:scale-102'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${getServiceDotColor(serviceType as ServiceType)} shadow-sm ${
                                isFiltered ? 'ring-2 ring-primary-foreground/30' : ''
                              }`} />
                              <span className="text-xs font-medium truncate">{serviceType}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs text-popover-foreground">
                              {isFiltered ? 'Click to remove filter' : 'Click to filter calendar by this service type'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
                {filteredServiceTypes.size > 0 && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground text-center"
                  >
                    Showing only {filteredServiceTypes.size} selected service type{filteredServiceTypes.size > 1 ? 's' : ''}
                  </motion.p>
                )}
              </motion.div>
              
              {/* Selected Date Details */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-foreground">
                      Services for {selectedDate.toLocaleDateString()}
                    </h3>
                    <motion.div 
                      variants={containerVariants}
                      className="grid gap-3"
                    >
                      {getEventsForDate(selectedDate).map((event, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div 
                                variants={cardVariants}
                                whileHover="hover"
                                className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full ${getServiceDotColor(event.serviceType)} shadow-sm`} />
                                  <div className="space-y-1">
                                    <Badge variant="secondary" className={`${getServiceTypeColor(event.serviceType)} text-xs`}>
                                      {event.serviceType}
                                    </Badge>
                                    <p className="font-medium text-foreground">{event.clientName}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm text-muted-foreground">
                                    Contract #{event.contractId.split('-')[1]}
                                  </span>
                                </div>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <div className="space-y-1">
                                <p className="font-medium text-popover-foreground">{event.serviceType}</p>
                                <p className="text-xs text-popover-foreground">Client: {event.clientName}</p>
                                <p className="text-xs text-muted-foreground">Contract ID: {event.contractId}</p>
                                <p className="text-xs text-muted-foreground">
                                  Date: {selectedDate.toLocaleDateString()}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {getEventsForDate(selectedDate).length === 0 && (
                        <motion.p 
                          variants={itemVariants}
                          className="text-muted-foreground text-center py-4"
                        >
                          No services scheduled for this date
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        ) : (
          <motion.div 
            key="yearly"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Yearly Overview Header */}
            <motion.div variants={itemVariants} className="text-center space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {currentMonth.getFullYear()} Service Overview
                </h3>
                <p className="text-muted-foreground">
                  Strategic view of all scheduled landscaping services
                </p>
              </div>
              
              {/* Key Metrics */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <motion.div variants={cardVariants} className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-primary">{serviceEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Total Services</div>
                </motion.div>
                <motion.div variants={cardVariants} className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {Array.from(new Set(serviceEvents.map(e => e.contractId))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Contracts</div>
                </motion.div>
                <motion.div variants={cardVariants} className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {Array.from(new Set(serviceEvents.map(e => e.serviceType))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Service Types</div>
                </motion.div>
                <motion.div variants={cardVariants} className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(serviceEvents.length / 12)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg/Month</div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Service Type Legend */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground">Service Types</h4>
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
              >
                {Array.from(new Set(serviceEvents.map(e => e.serviceType))).map(serviceType => {
                  const count = serviceEvents.filter(e => e.serviceType === serviceType).length;
                  const percentage = Math.round((count / serviceEvents.length) * 100);
                  return (
                    <motion.div 
                      key={serviceType} 
                      variants={cardVariants}
                      whileHover="hover"
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded-full ${getServiceTypeColor(serviceType).split(' ')[0]} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{serviceType}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{count} services</p>
                          <Badge variant="outline" className="text-xs">
                            {percentage}%
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
            
            {/* Monthly Grid */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground">Monthly Breakdown</h4>
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const month = new Date(currentMonth.getFullYear(), i, 1);
                  const monthEvents = serviceEvents.filter(event => 
                    event.date.getMonth() === i && event.date.getFullYear() === currentMonth.getFullYear()
                  );
                  
                  const isCurrentMonth = new Date().getMonth() === i && new Date().getFullYear() === currentMonth.getFullYear();
                  
                  return (
                    <motion.div
                      key={i}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200 ${
                          isCurrentMonth ? 'ring-2 ring-primary bg-primary/10 text-primary-foreground' : 'bg-card text-card-foreground'
                        }`}
                        onClick={() => {
                          setCurrentMonth(month);
                          setViewMode('monthly');
                        }}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {month.toLocaleDateString('en-US', { month: 'long' })}
                            </h4>
                            {isCurrentMonth && (
                              <Badge className="bg-primary text-primary-foreground">Current</Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Services:</span>
                              <span className="text-sm font-medium text-foreground">{monthEvents.length}</span>
                            </div>
                            
                            {monthEvents.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">Service Types:</span>
                                <div className="flex flex-wrap gap-1">
                                  {Array.from(new Set(monthEvents.map(e => e.serviceType))).slice(0, 4).map(serviceType => (
                                    <div
                                      key={serviceType}
                                      className={`w-3 h-3 rounded-full ${getServiceTypeColor(serviceType).split(' ')[0]}`}
                                      title={serviceType}
                                    />
                                  ))}
                                  {Array.from(new Set(monthEvents.map(e => e.serviceType))).length > 4 && (
                                    <div className="w-3 h-3 rounded-full bg-muted-foreground" title="More types..." />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {monthEvents.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-2">No services scheduled</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default StrategicCalendar;
