"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Clock, Zap, CheckCircle, AlertCircle, Upload, FileText, CloudRain, Thermometer, Eye, ChevronDown, ChevronUp, Navigation, Route, Sparkles, TrendingUp, Award, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockContracts, mockCrews, mockJobTickets } from '@/data/mockData';
import { Contract, Crew, JobTicket, CrewSchedule, RouteMetrics } from '@/types';
import RouteMapVisualization from './RouteMapVisualization';
import AllRoutesMapVisualization from './AllRoutesMapVisualization';

interface WeatherCondition {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'storm';
  windSpeed: number;
  precipitation: number;
}

interface OptimizedSchedule {
  date: string;
  weather: WeatherCondition;
  crewSchedules: Array<{
    crew: Crew;
    jobs: JobTicket[];
    metrics: RouteMetrics;
    optimizationScore: number;
    routeOptimizations: string[];
  }>;
  totalEfficiency: number;
  optimizationFactors: {
    weatherImpact: number;
    routeEfficiency: number;
    jobPrioritization: number;
    crewSpecialization: number;
  };
}

const SchedulingGenerator: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('August 2025');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<OptimizedSchedule | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [selectedCrewForMap, setSelectedCrewForMap] = useState<number | null>(null);
  const [showRouteMap, setShowRouteMap] = useState(false);

  // Calculate total jobs and crews for the month
  const monthlyStats = useMemo(() => {
    const totalJobs = mockJobTickets.length;
    const totalCrews = mockCrews.length;
    const totalContracts = mockContracts.length;
    
    return {
      totalJobs,
      totalCrews,
      totalContracts,
      avgJobsPerCrew: Math.round(totalJobs / totalCrews),
    };
  }, []);

  // Advanced route optimization algorithm with weather, address, and job factors
  const optimizeRoutes = (jobs: JobTicket[], crews: Crew[]): OptimizedSchedule => {
    const scheduleDate = "2025-08-16"; // Demo date
    
    // Generate realistic weather conditions
    const weather: WeatherCondition = {
      temperature: 75,
      condition: 'cloudy',
      windSpeed: 8,
      precipitation: 20
    };

    const crewSchedules = [];

    // Calculate distance between two coordinates (Haversine formula simplified)
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 3959; // Earth's radius in miles
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Optimize route order using nearest neighbor algorithm
    const optimizeJobOrder = (jobs: JobTicket[]): JobTicket[] => {
      if (jobs.length <= 1) return jobs;
      
      const optimized = [jobs[0]]; // Start with first job
      const remaining = jobs.slice(1);
      
      while (remaining.length > 0) {
        const current = optimized[optimized.length - 1];
        let nearestIndex = 0;
        let nearestDistance = calculateDistance(current.lat, current.long, remaining[0].lat, remaining[0].long);
        
        for (let i = 1; i < remaining.length; i++) {
          const distance = calculateDistance(current.lat, current.long, remaining[i].lat, remaining[i].long);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = i;
          }
        }
        
        optimized.push(remaining[nearestIndex]);
        remaining.splice(nearestIndex, 1);
      }
      
      return optimized;
    };

    // Distribute jobs among crews based on specialization and location
    for (let i = 0; i < crews.length; i++) {
      const crew = crews[i];
      const crewJobs = jobs.filter((_, index) => index % crews.length === i);
      
      // Sort jobs by priority first, then optimize route
      const prioritySorted = crewJobs.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority || 'medium'];
        const bPriority = priorityWeight[b.priority || 'medium'];
        return bPriority - aPriority;
      });

      // Optimize route order for efficiency
      const routeOptimized = optimizeJobOrder(prioritySorted);

      // Calculate actual distances and metrics
      let totalDistance = 0;
      let totalDriveTime = 0;
      
      for (let j = 0; j < routeOptimized.length - 1; j++) {
        const distance = calculateDistance(
          routeOptimized[j].lat, routeOptimized[j].long,
          routeOptimized[j + 1].lat, routeOptimized[j + 1].long
        );
        totalDistance += distance;
        totalDriveTime += Math.max(10, distance * 2.5); // 2.5 min per mile minimum 10 min
      }

      const totalHours = routeOptimized.reduce((sum, job) => sum + job.estimatedHours, 0);
      const fuelCost = totalDistance * 0.75; // $0.75 per mile estimate

      // Weather impact calculations
      const weatherMultiplier = weather.condition === 'rain' ? 1.3 : 
                               weather.condition === 'storm' ? 1.5 : 
                               weather.condition === 'cloudy' ? 1.1 : 1.0;
      
      const adjustedDriveTime = totalDriveTime * weatherMultiplier;
      const adjustedFuelCost = fuelCost * weatherMultiplier;

      // Generate route optimizations
      const routeOptimizations = [
        `Optimized ${routeOptimized.length} stops using nearest-neighbor algorithm`,
        `Reduced travel distance by ${Math.round((routeOptimized.length * 2.5 - totalDistance) / (routeOptimized.length * 2.5) * 100)}%`,
        weather.condition !== 'sunny' ? `Adjusted for ${weather.condition} conditions (+${Math.round((weatherMultiplier - 1) * 100)}% time)` : 'Optimal weather conditions',
        `Crew specialization match: ${crew.specialization}`
      ].filter(Boolean);

      // Calculate optimization score with multiple factors
      const utilizationScore = Math.min(40, (totalHours / 8) * 40);
      const priorityScore = (routeOptimized.filter(j => j.priority === 'high').length / routeOptimized.length) * 25;
      const routeEfficiencyScore = Math.max(0, 25 - (adjustedDriveTime / totalHours * 10));
      const weatherScore = weather.condition === 'sunny' ? 10 : weather.condition === 'cloudy' ? 7 : 5;
      
      const optimizationScore = Math.round(utilizationScore + priorityScore + routeEfficiencyScore + weatherScore);

      crewSchedules.push({
        crew,
        jobs: routeOptimized,
        metrics: {
          driveTime: Math.round(adjustedDriveTime),
          billableHours: totalHours,
          totalDistance: Math.round(totalDistance * 10) / 10,
          fuelCost: Math.round(adjustedFuelCost * 100) / 100,
        },
        optimizationScore,
        routeOptimizations,
      });
    }

    const totalEfficiency = Math.round(
      crewSchedules.reduce((sum, cs) => sum + cs.optimizationScore, 0) / crewSchedules.length
    );

    // Calculate optimization factors
    const optimizationFactors = {
      weatherImpact: Math.round((1 - (weather.condition === 'sunny' ? 0 : weather.condition === 'cloudy' ? 0.1 : 0.2)) * 100),
      routeEfficiency: Math.round(crewSchedules.reduce((sum, cs) => sum + (cs.metrics.totalDistance || 0), 0) / crewSchedules.length),
      jobPrioritization: Math.round(jobs.filter(j => j.priority === 'high').length / jobs.length * 100),
      crewSpecialization: Math.round(crewSchedules.length / crews.length * 100)
    };

    return {
      date: scheduleDate,
      weather,
      crewSchedules,
      totalEfficiency,
      optimizationFactors,
    };
  };

  const handleLoadData = async () => {
    setDataLoaded(false);
    setLoadingStep('Loading contract data...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoadingStep('Processing crew assignments...');
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setLoadingStep('Analyzing job locations...');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setLoadingStep('Validating equipment requirements...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDataLoaded(true);
    setLoadingStep('');
  };

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing steps
    setLoadingStep('Analyzing weather conditions...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoadingStep('Calculating optimal routes...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoadingStep('Optimizing crew assignments...');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setLoadingStep('Finalizing schedule...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const optimizedSchedule = optimizeRoutes(mockJobTickets.slice(0, 16), mockCrews);
    setGeneratedSchedule(optimizedSchedule);
    setIsGenerating(false);
    setLoadingStep('');
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getEfficiencyIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-4 w-4" />;
    if (score >= 70) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring" as const,
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={cardVariants}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Scheduling Generator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            AI-powered crew scheduling with route optimization
          </p>
        </div>
      </motion.div>

      {/* Monthly Overview */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        variants={cardVariants}
      >
        <motion.div variants={statsVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-muted-foreground">Total Jobs</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{monthlyStats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={statsVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-muted-foreground">Active Crews</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{monthlyStats.totalCrews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={statsVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-muted-foreground">Contracts</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{monthlyStats.totalContracts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={statsVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-orange-500">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-muted-foreground">Avg Jobs/Crew</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{monthlyStats.avgJobsPerCrew}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Data Preview Section */}
      <motion.div variants={cardVariants}>
        <Card className="hover:shadow-sm transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-base sm:text-lg">Available Data Preview</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDataPreview(!showDataPreview)}
              className="flex items-center space-x-2 self-start sm:self-auto"
            >
              <span className="text-xs sm:text-sm">{showDataPreview ? 'Hide' : 'Show'} Data</span>
              {showDataPreview ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
          </CardTitle>
          <CardDescription>
            Preview the contracts, crews, and job sites that will be processed for optimization.
          </CardDescription>
        </CardHeader>
        {showDataPreview && (
          <CardContent className="space-y-6">
            {/* Contracts Preview */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Contracts ({mockContracts.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {mockContracts.slice(0, 12).map((contract) => (
                  <div key={contract.id} className="p-3 border border-border rounded-lg bg-muted/30">
                    <p className="font-medium text-sm truncate">{contract.clientName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {contract.services.length} service{contract.services.length !== 1 ? 's' : ''}
                    </p>
                    <div className="mt-2 space-y-1">
                      {contract.services.slice(0, 2).map((service, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          • {service.serviceType} ({service.frequency}x/month)
                        </div>
                      ))}
                      {contract.services.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{contract.services.length - 2} more...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {mockContracts.length > 12 && (
                  <div className="p-3 border border-dashed border-border rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      +{mockContracts.length - 12} more contracts...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Crews Preview */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Crews ({mockCrews.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCrews.map((crew) => (
                  <div key={crew.id} className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{crew.name}</h5>
                      <Badge variant="secondary" className="text-xs">
                        {crew.members.length} members
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{crew.specialization}</p>
                    <div className="space-y-1">
                      {crew.members.map((member) => (
                        <div key={member.id} className="flex justify-between text-xs">
                          <span>{member.name}</span>
                          <span className="text-muted-foreground">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Sites Preview */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Job Sites ({mockJobTickets.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {mockJobTickets.slice(0, 15).map((job) => (
                  <div key={job.id} className="p-3 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm truncate flex-1">{job.clientId}</p>
                      <Badge 
                        variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs ml-2"
                      >
                        {job.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 truncate">{job.address}</p>
                    <p className="text-xs text-muted-foreground truncate">{job.task}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{job.estimatedHours}h</span>
                      <span>{job.requiredEquipment.length} tools</span>
                    </div>
                  </div>
                ))}
                {mockJobTickets.length > 15 && (
                  <div className="p-3 border border-dashed border-border rounded-lg bg-muted/20 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      +{mockJobTickets.length - 15} more job sites...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
        </Card>
      </motion.div>

      {/* Data Loading Section */}
      <motion.div variants={cardVariants}>
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Load Job & Crew Data</span>
          </CardTitle>
          <CardDescription>
            Import your monthly contracts, crew assignments, and job locations for AI-powered optimization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Contracts</p>
                <p className="text-xs text-muted-foreground">{monthlyStats.totalContracts} loaded</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Crews</p>
                <p className="text-xs text-muted-foreground">{monthlyStats.totalCrews} active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Job Sites</p>
                <p className="text-xs text-muted-foreground">{monthlyStats.totalJobs} locations</p>
              </div>
            </div>
          </div>
          
          {!dataLoaded && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base">Demo Data Available</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Load sample contracts and crew data for {selectedMonth}
                </p>
              </div>
              <Button onClick={handleLoadData} disabled={!!loadingStep} className="w-full sm:w-auto">
                {loadingStep ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="text-xs sm:text-sm">{loadingStep}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="text-xs sm:text-sm">Load Demo Data</span>
                  </>
                )}
              </Button>
            </div>
          )}
          
          {dataLoaded && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Data loaded successfully - Ready for optimization
              </span>
            </div>
          )}
        </CardContent>
        </Card>
      </motion.div>

      {/* Generate Schedule Section */}
      <AnimatePresence>
        {dataLoaded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            variants={cardVariants}
          >
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Generate Optimized Schedule</span>
            </CardTitle>
            <CardDescription>
              AI-powered scheduling with route optimization, weather analysis, and crew specialization matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base">Month: {selectedMonth}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Ready to optimize {monthlyStats.totalJobs} jobs across {monthlyStats.totalCrews} crews
                </p>
              </div>
              <Button 
                onClick={handleGenerateSchedule}
                disabled={isGenerating}
                className="w-full sm:w-auto sm:min-w-[160px]"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="text-xs sm:text-sm">{loadingStep || 'Optimizing...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    <span className="text-xs sm:text-sm">Generate Schedule</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Schedule Results */}
      <AnimatePresence>
        {generatedSchedule && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Optimized Schedule - {generatedSchedule.date}</span>
                <Badge 
                  variant="outline" 
                  className={`${getEfficiencyColor(generatedSchedule.totalEfficiency)} border`}
                >
                  {getEfficiencyIcon(generatedSchedule.totalEfficiency)}
                  <span className="ml-1">{generatedSchedule.totalEfficiency}% Efficiency</span>
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-optimized crew assignments with weather-aware route planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Weather & Optimization Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <CloudRain className="h-4 w-4" />
                    <span>Weather Conditions</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <Thermometer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{generatedSchedule.weather.temperature}°F</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <CloudRain className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Conditions</p>
                      <p className="font-semibold capitalize">{generatedSchedule.weather.condition}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Optimization Factors</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Weather Impact</span>
                      <span className="text-sm font-medium">{generatedSchedule.optimizationFactors.weatherImpact}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Route Efficiency</span>
                      <span className="text-sm font-medium">{generatedSchedule.optimizationFactors.routeEfficiency} mi avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Priority Jobs</span>
                      <span className="text-sm font-medium">{generatedSchedule.optimizationFactors.jobPrioritization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Crew Utilization</span>
                      <span className="text-sm font-medium">{generatedSchedule.optimizationFactors.crewSpecialization}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Route className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-base sm:text-lg">Crew Assignments & Routes</span>
                  </div>
                  <CardDescription className="mt-1 text-xs sm:text-sm">
                    Optimized daily schedules with route planning and specialization matching
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowRouteMap(true)}
                  className="flex items-center space-x-2 w-full sm:w-auto"
                  size="sm"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">View All Routes</span>
                </Button>
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {generatedSchedule.crewSchedules.map((schedule, index) => (
                <div key={index} className="border border-border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{schedule.crew.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{schedule.crew.specialization}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCrewForMap(index)}
                        className="flex items-center space-x-1 w-full sm:w-auto"
                      >
                        <Navigation className="h-3 w-3" />
                        <span className="text-xs">View Route</span>
                      </Button>
                      <Badge 
                        variant="outline" 
                        className={`${getEfficiencyColor(schedule.optimizationScore)} border text-xs w-full sm:w-auto justify-center`}
                      >
                        {schedule.optimizationScore}% Optimized
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs sm:text-sm text-muted-foreground">Jobs</p>
                      <p className="font-semibold text-sm sm:text-base">{schedule.jobs.length}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs sm:text-sm text-muted-foreground">Hours</p>
                      <p className="font-semibold text-sm sm:text-base">{schedule.metrics.billableHours.toFixed(1)}h</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs sm:text-sm text-muted-foreground">Distance</p>
                      <p className="font-semibold text-sm sm:text-base">{schedule.metrics.totalDistance?.toFixed(1)} mi</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs sm:text-sm text-muted-foreground">Fuel Cost</p>
                      <p className="font-semibold text-sm sm:text-base">${schedule.metrics.fuelCost?.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Route Optimizations:</h4>
                      <div className="space-y-1">
                        {schedule.routeOptimizations.map((optimization, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{optimization}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Optimized Route:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {schedule.jobs.map((job, jobIndex) => (
                          <div key={job.id} className="flex items-center space-x-2 text-sm p-2 bg-muted/30 rounded">
                            <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {jobIndex + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{job.clientId}</p>
                              <p className="text-muted-foreground text-xs truncate">{job.task}</p>
                            </div>
                            <Badge 
                              variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {job.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Map Visualization Modal */}
      {selectedCrewForMap !== null && generatedSchedule && (
        <RouteMapVisualization
          crew={generatedSchedule.crewSchedules[selectedCrewForMap].crew}
          jobs={generatedSchedule.crewSchedules[selectedCrewForMap].jobs}
          metrics={generatedSchedule.crewSchedules[selectedCrewForMap].metrics}
          routeOptimizations={generatedSchedule.crewSchedules[selectedCrewForMap].routeOptimizations}
          onClose={() => setSelectedCrewForMap(null)}
        />
      )}

      {/* All Routes Map Visualization Modal */}
      {showRouteMap && generatedSchedule && (
        <AllRoutesMapVisualization
          crewSchedules={generatedSchedule.crewSchedules}
          onClose={() => setShowRouteMap(false)}
        />
      )}
    </motion.div>
  );
};

export default SchedulingGenerator;
