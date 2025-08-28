"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, MapPin, Plus, Route, Fuel, RefreshCw, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Crew, JobTicket, RouteMetrics } from '@/types';
import DraggableJobCard from './DraggableJobCard';

interface DroppableCrewZoneProps {
  crew: Crew;
  jobs: JobTicket[];
  className?: string;
  crewColor?: string;
  totalDriveTime?: number;
  totalBillableHours?: number;
  metrics?: RouteMetrics;
  efficiency?: number;
  isCalculating?: boolean;
}

const DroppableCrewZone: React.FC<DroppableCrewZoneProps> = ({
  crew,
  jobs,
  className,
  crewColor = 'hsl(var(--chart-1))',
  totalDriveTime = 45,
  totalBillableHours = 8.5,
  metrics,
  efficiency,
  isCalculating = false
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: crew.id,
    data: {
      type: 'crew',
      crew,
    },
  });

  // Animation variants following established patterns
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  // Format time for display
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full", className)}
    >
      <Card 
        ref={setNodeRef}
        className={cn(
          "bg-card text-card-foreground border-border transition-all duration-200",
          isOver && "bg-accent/50 border-primary/50 shadow-lg ring-2 ring-primary/20"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: crewColor }}
                />
                <span className="text-lg font-semibold">{crew.name}</span>
                <Badge variant="outline" className="text-xs">
                  {jobs.length} jobs
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{crew.specialization}</span>
                <span className="text-muted-foreground">•</span>
                <span>{crew.members.length} members</span>
              </CardDescription>
            </div>

            {/* Dynamic Crew Metrics */}
            <div className="text-right space-y-1">
              {isCalculating ? (
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4 text-chart-1 animate-spin" />
                  <span className="text-muted-foreground">Calculating...</span>
                </div>
              ) : metrics ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Route className="w-4 h-4 text-chart-2" />
                    <span className="text-foreground">{metrics.totalDistance}mi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-chart-3" />
                    <span className="text-foreground">{formatTime(metrics.driveTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Fuel className="w-3 h-3 text-chart-4" />
                    <span className="text-muted-foreground">${metrics.fuelCost}</span>
                  </div>
                  {efficiency !== undefined && (
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className={`w-3 h-3 ${efficiency >= 80 ? 'text-chart-1' : efficiency >= 60 ? 'text-chart-3' : 'text-chart-5'}`} />
                      <span className={efficiency >= 80 ? 'text-chart-1' : efficiency >= 60 ? 'text-chart-3' : 'text-chart-5'}>
                        {efficiency}% eff
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{formatTime(totalDriveTime)} drive</span>
                </div>
              )}
            </div>
          </div>

          {/* Drop Zone Indicator */}
          {isOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 mt-3"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Drop job here to assign to {crew.name}</span>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Crew Members */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Team Members</h4>
            <div className="flex flex-wrap gap-2">
              {crew.members.map((member) => (
                <Badge 
                  key={member.id} 
                  variant="secondary" 
                  className="text-xs bg-muted/50 text-muted-foreground"
                >
                  {member.name} ({member.role})
                </Badge>
              ))}
            </div>
          </div>

          {/* Assigned Jobs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Assigned Jobs</h4>
              {jobs.length === 0 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  No jobs assigned
                </Badge>
              )}
            </div>

            {/* Job List */}
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className={cn(
                    "flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-colors duration-200",
                    isOver 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border bg-muted/20"
                  )}
                >
                  <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {isOver ? "Drop job here" : "No jobs assigned yet"}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Drag jobs from other crews or the unassigned list
                  </p>
                </motion.div>
              ) : (
                jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <DraggableJobCard
                      job={job}
                      crewAssigned={crew.name}
                      estimatedArrival={`${8 + index}:${(index * 30) % 60}0 AM`}
                      estimatedCompletion={`${9 + index + Math.floor(job.estimatedHours)}:${((index * 30) % 60) + 30}0 AM`}
                      isActive={index === 0}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Drop Zone Visual Feedback */}
          {isOver && jobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20"
            >
              <Plus className="w-4 h-4 text-chart-2" />
              <span className="text-sm text-chart-2 font-medium">Add to end of route</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DroppableCrewZone;
