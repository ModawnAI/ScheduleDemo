"use client";

import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Route,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockCrews, mockJobTickets } from '@/data/mockData';
import { JobTicket, RouteMetrics } from '@/types';
import { 
  calculateRouteMetrics, 
  calculateRouteEfficiency, 
  compareRouteMetrics,
  debounce 
} from '@/lib/routeUtils';
import DraggableJobCard from './DraggableJobCard';
import DroppableCrewZone from './DroppableCrewZone';
import { useCalendar } from '@/contexts/CalendarContext';

interface DragDropDashboardProps {
  className?: string;
}

interface CrewAssignment {
  crewId: string;
  jobs: JobTicket[];
  metrics?: RouteMetrics;
  efficiency?: number;
  isCalculating?: boolean;
}

const DragDropDashboard: React.FC<DragDropDashboardProps> = ({ className }) => {
  const { selectedDate, isLoading, error } = useCalendar();
  
  // Initialize crew assignments with some jobs
  const [crewAssignments, setCrewAssignments] = useState<CrewAssignment[]>(() => {
    const assignments: CrewAssignment[] = mockCrews.map((crew, index) => ({
      crewId: crew.id,
      jobs: mockJobTickets.slice(index * 3, (index + 1) * 3)
    }));
    return assignments;
  });

  // Unassigned jobs
  const [unassignedJobs, setUnassignedJobs] = useState<JobTicket[]>(() => {
    const assignedJobIds = new Set(
      crewAssignments.flatMap(assignment => assignment.jobs.map(job => job.id))
    );
    return mockJobTickets.filter(job => !assignedJobIds.has(job.id));
  });

  const [activeJob, setActiveJob] = useState<JobTicket | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [metricsUpdateQueue, setMetricsUpdateQueue] = useState<Set<string>>(new Set());

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Debounced metrics calculation function
  const calculateMetricsForCrew = useCallback((crewId: string, jobs: JobTicket[]) => {
      if (jobs.length === 0) {
        setCrewAssignments(prev => 
          prev.map(assignment => 
            assignment.crewId === crewId 
              ? { ...assignment, metrics: undefined, efficiency: undefined, isCalculating: false }
              : assignment
          )
        );
        return;
      }

      // Calculate metrics with visual feedback
      const metrics = calculateRouteMetrics(jobs);
      const efficiency = calculateRouteEfficiency(metrics);

      setCrewAssignments(prev => 
        prev.map(assignment => 
          assignment.crewId === crewId 
            ? { ...assignment, metrics, efficiency, isCalculating: false }
            : assignment
        )
      );

      // Remove from update queue
      setMetricsUpdateQueue(prev => {
        const newQueue = new Set(prev);
        newQueue.delete(crewId);
        return newQueue;
      });
    }, []);

  const debouncedCalculateMetrics = calculateMetricsForCrew;

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const job = active.data.current?.job;
    if (job) {
      setActiveJob(job);
    }
  }, []);

  // Handle job movement between crews with debounced metrics updates
  const handleJobMove = useCallback((
    job: JobTicket, 
    sourceCrewId: string | null, 
    targetCrewId: string
  ) => {
    setCrewAssignments(prev => {
      const newAssignments = [...prev];

      // Remove from source crew and mark for metrics update
      if (sourceCrewId) {
        const sourceIndex = newAssignments.findIndex(a => a.crewId === sourceCrewId);
        if (sourceIndex !== -1) {
          newAssignments[sourceIndex] = {
            ...newAssignments[sourceIndex],
            jobs: newAssignments[sourceIndex].jobs.filter(j => j.id !== job.id),
            isCalculating: true
          };
        }
      }

      // Add to target crew and mark for metrics update
      const targetIndex = newAssignments.findIndex(a => a.crewId === targetCrewId);
      if (targetIndex !== -1) {
        newAssignments[targetIndex] = {
          ...newAssignments[targetIndex],
          jobs: [...newAssignments[targetIndex].jobs, job],
          isCalculating: true
        };
      }

      return newAssignments;
    });

    // Remove from unassigned if it was there
    if (!sourceCrewId) {
      setUnassignedJobs(prev => prev.filter(j => j.id !== job.id));
    }

    // Add crews to metrics update queue
    const crewsToUpdate = [targetCrewId];
    if (sourceCrewId) crewsToUpdate.push(sourceCrewId);
    
    setMetricsUpdateQueue(prev => {
      const newQueue = new Set(prev);
      crewsToUpdate.forEach(crewId => newQueue.add(crewId));
      return newQueue;
    });

    // Trigger debounced metrics calculation for affected crews
    setTimeout(() => {
      crewsToUpdate.forEach(crewId => {
        const assignment = crewAssignments.find(a => a.crewId === crewId);
        if (assignment) {
          debouncedCalculateMetrics(crewId, assignment.jobs);
        }
      });
    }, 100);

    // Show success feedback with loading state
    console.log(`Job "${job.task}" moved to ${mockCrews.find(c => c.id === targetCrewId)?.name} - updating metrics...`);
  }, [crewAssignments, debouncedCalculateMetrics]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeJobId = active.id as string;
    const overCrewId = over.id as string;

    // Find the job being moved
    let sourceJob: JobTicket | null = null;
    let sourceCrewId: string | null = null;

    // Check crew assignments
    for (const assignment of crewAssignments) {
      const job = assignment.jobs.find(j => j.id === activeJobId);
      if (job) {
        sourceJob = job;
        sourceCrewId = assignment.crewId;
        break;
      }
    }

    // Check unassigned jobs
    if (!sourceJob) {
      sourceJob = unassignedJobs.find(j => j.id === activeJobId) || null;
    }

    if (!sourceJob) return;

    // If dropping on the same crew, do nothing
    if (sourceCrewId === overCrewId) return;

    // Handle job move with optimistic updates
    handleJobMove(sourceJob, sourceCrewId, overCrewId);
  }, [crewAssignments, unassignedJobs, handleJobMove]);

  // Handle route optimization
  const handleOptimizeRoutes = useCallback(async () => {
    setOptimizing(true);
    
    // Simulate optimization delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would call an optimization API
    // For now, we'll just shuffle the jobs within each crew
    setCrewAssignments(prev => 
      prev.map(assignment => ({
        ...assignment,
        jobs: [...assignment.jobs].sort(() => Math.random() - 0.5)
      }))
    );
    
    setOptimizing(false);
  }, []);

  // Calculate total metrics
  const totalJobs = crewAssignments.reduce((sum, assignment) => sum + assignment.jobs.length, 0) + unassignedJobs.length;
  const completedJobs = crewAssignments.reduce((sum, assignment) => 
    sum + assignment.jobs.filter(job => job.status === 'completed').length, 0
  );
  const activeCrews = crewAssignments.filter(assignment => assignment.jobs.length > 0).length;

  // Crew colors
  const crewColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-chart-1 rounded-full animate-pulse" />
          <div className="w-4 h-4 bg-chart-2 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-4 h-4 bg-chart-3 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          <span className="text-muted-foreground ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive text-sm font-medium mb-2">Error loading dashboard</p>
        <p className="text-muted-foreground text-xs mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-xs font-medium hover:bg-destructive/90 transition-colors duration-200"
        >
          Reload Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-background text-foreground font-sans", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Dashboard Header */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Drag & Drop Mission Control</h1>
                  <p className="text-muted-foreground">
                    Interactive crew scheduling - {selectedDate || new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                {/* Optimize Button */}
                <motion.div variants={itemVariants}>
                  <Button 
                    onClick={handleOptimizeRoutes}
                    disabled={optimizing}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                  >
                    {optimizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Route className="w-4 h-4 mr-2" />
                        Optimize Routes
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              >
                {[
                  { icon: Calendar, label: "Total Jobs", value: totalJobs.toString(), color: "text-chart-1" },
                  { icon: Users, label: "Active Crews", value: activeCrews.toString(), color: "text-chart-2" },
                  { icon: CheckCircle, label: "Completed", value: completedJobs.toString(), color: "text-chart-3" },
                  { icon: Route, label: "Unassigned", value: unassignedJobs.length.toString(), color: "text-chart-4" }
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-md bg-primary/10 ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-card-foreground">{stat.label}</p>
                      <p className="text-lg sm:text-xl font-bold text-primary">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Main Dashboard Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
            >
              
              {/* Crew Assignment Zones */}
              {mockCrews.map((crew, index) => {
                const assignment = crewAssignments.find(a => a.crewId === crew.id);
                const jobs = assignment?.jobs || [];
                
                return (
                  <motion.div key={crew.id} variants={itemVariants}>
                    <DroppableCrewZone
                      crew={crew}
                      jobs={jobs}
                      crewColor={crewColors[index % crewColors.length]}
                      totalDriveTime={45 + (index * 7)}
                      totalBillableHours={8.5 - (index * 0.5)}
                      metrics={assignment?.metrics}
                      efficiency={assignment?.efficiency}
                      isCalculating={assignment?.isCalculating}
                    />
                  </motion.div>
                );
              })}

            </motion.div>

            {/* Unassigned Jobs */}
            {unassignedJobs.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <AlertCircle className="w-5 h-5 text-chart-4" />
                      Unassigned Jobs
                    </CardTitle>
                    <CardDescription>Jobs that need to be assigned to crews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unassignedJobs.map((job) => (
                        <DraggableJobCard
                          key={job.id}
                          job={job}
                          crewAssigned="Unassigned"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeJob ? (
            <DraggableJobCard
              job={activeJob}
              isDragDisabled={true}
              className="rotate-2 shadow-2xl"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DragDropDashboard;
