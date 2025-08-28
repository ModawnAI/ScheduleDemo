"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Wrench, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  MoreVertical,
  Navigation,
  Phone,
  Calendar,
  GripVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { JobTicket } from '@/types';

interface DraggableJobCardProps {
  job: JobTicket;
  estimatedArrival?: string;
  estimatedCompletion?: string;
  crewAssigned?: string;
  isActive?: boolean;
  className?: string;
  isDragDisabled?: boolean;
}

const DraggableJobCard: React.FC<DraggableJobCardProps> = ({
  job,
  estimatedArrival = "10:30 AM",
  estimatedCompletion = "12:00 PM", 
  crewAssigned = "Alpha Team",
  isActive = false,
  className,
  isDragDisabled = false
}) => {
  // Set up draggable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: job.id,
    disabled: isDragDisabled,
    data: {
      type: 'job',
      job,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Get priority styling based on job priority
  const getPriorityStyling = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-chart-1 text-primary-foreground',
          border: 'border-chart-1/20',
          indicator: 'bg-chart-1'
        };
      case 'medium':
        return {
          badge: 'bg-chart-2 text-primary-foreground',
          border: 'border-chart-2/20',
          indicator: 'bg-chart-2'
        };
      case 'low':
        return {
          badge: 'bg-chart-4 text-primary-foreground',
          border: 'border-chart-4/20',
          indicator: 'bg-chart-4'
        };
      default:
        return {
          badge: 'bg-muted text-muted-foreground',
          border: 'border-muted',
          indicator: 'bg-muted-foreground'
        };
    }
  };

  // Get status styling based on job status
  const getStatusStyling = (status: string) => {
    switch (status) {
      case 'in-progress':
        return {
          badge: 'bg-chart-1 text-primary-foreground',
          icon: Play,
          color: 'text-chart-1'
        };
      case 'completed':
        return {
          badge: 'bg-chart-3 text-primary-foreground',
          icon: CheckCircle,
          color: 'text-chart-3'
        };
      case 'cancelled':
        return {
          badge: 'bg-destructive text-destructive-foreground',
          icon: AlertTriangle,
          color: 'text-destructive'
        };
      case 'pending':
      default:
        return {
          badge: 'bg-muted text-muted-foreground',
          icon: Pause,
          color: 'text-muted-foreground'
        };
    }
  };

  const priorityStyle = getPriorityStyling(job.priority || 'medium');
  const statusStyle = getStatusStyling(job.status || 'pending');
  const StatusIcon = statusStyle.icon;

  // Animation variants following established patterns
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: isDragging ? 1.05 : 1.02,
      transition: { duration: 0.2 }
    },
    dragging: {
      scale: 1.05,
      rotate: 2,
      zIndex: 1000,
      transition: { duration: 0.2 }
    }
  };

  // Format estimated hours for display
  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={cardVariants}
      initial="hidden"
      animate={isDragging ? "dragging" : "visible"}
      whileHover={!isDragging ? "hover" : undefined}
      className={cn(
        "w-full cursor-grab active:cursor-grabbing",
        isDragging && "z-50",
        isDragDisabled && "cursor-default",
        className
      )}
      {...attributes}
    >
      <Card className={cn(
        "bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
        priorityStyle.border,
        isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        isDragging && 'shadow-2xl bg-card/95 backdrop-blur-sm border-primary/50',
        isDragDisabled && 'opacity-60'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <StatusIcon className={`w-5 h-5 ${statusStyle.color}`} />
                <span className="truncate">{job.task}</span>
                <div className={`w-2 h-2 rounded-full ${priorityStyle.indicator} shadow-sm`} />
              </CardTitle>
              <CardDescription className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{job.address}</span>
              </CardDescription>
            </div>
            
            {/* Priority Badge and Drag Handle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={`${priorityStyle.badge} text-xs font-medium`}>
                {(job.priority || 'medium').charAt(0).toUpperCase() + (job.priority || 'medium').slice(1)}
              </Badge>
              {!isDragDisabled && (
                <div
                  {...listeners}
                  className="p-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-grab active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Job Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Schedule</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{formatHours(job.estimatedHours)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Arrival: {estimatedArrival}
                </div>
                <div className="text-xs text-muted-foreground">
                  Complete: {estimatedCompletion}
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Status</h4>
              <div className="space-y-1">
                <Badge className={`${statusStyle.badge} text-xs font-medium w-fit`}>
                  {(job.status || 'pending').charAt(0).toUpperCase() + (job.status || 'pending').slice(1).replace('-', ' ')}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Crew: {crewAssigned}
                </div>
              </div>
            </div>
          </div>

          {/* Equipment & Materials */}
          <div className="space-y-3">
            {/* Required Equipment */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                Equipment
              </h4>
              <div className="flex flex-wrap gap-1">
                {job.requiredEquipment.slice(0, 3).map((equipment, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                    {equipment}
                  </Badge>
                ))}
                {job.requiredEquipment.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                    +{job.requiredEquipment.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Required Materials */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                Materials
              </h4>
              <div className="flex flex-wrap gap-1">
                {job.requiredMaterials.slice(0, 3).map((material, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                    {material}
                  </Badge>
                ))}
                {job.requiredMaterials.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                    +{job.requiredMaterials.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Service Type */}
          {job.serviceType && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 border border-primary/20">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">{job.serviceType}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant={isActive ? "default" : "outline"}
              size="sm" 
              className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Navigation className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Job Indicator */}
          {isActive && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-chart-1/10 border border-chart-1/20">
              <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
              <p className="text-sm text-chart-1 font-medium">Currently Active</p>
            </div>
          )}

          {/* Dragging Indicator */}
          {isDragging && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 border border-primary/20">
              <GripVertical className="w-4 h-4 text-primary animate-pulse" />
              <p className="text-sm text-primary font-medium">Moving job...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DraggableJobCard;
