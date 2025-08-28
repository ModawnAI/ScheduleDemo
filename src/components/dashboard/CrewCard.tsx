"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Crew, CrewMember } from '@/types';

interface CrewCardProps {
  crew: Crew;
  status?: 'active' | 'idle' | 'offline' | 'en-route';
  currentLocation?: string;
  currentJob?: string;
  completedJobs?: number;
  estimatedCompletion?: string;
  className?: string;
}

const CrewCard: React.FC<CrewCardProps> = ({
  crew,
  status = 'active',
  currentLocation = 'Downtown Area',
  currentJob = 'Weekly Mowing - Sunset Plaza',
  completedJobs = 3,
  estimatedCompletion = '2:30 PM',
  className
}) => {
  // Get status styling based on crew status
  const getStatusStyling = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: 'bg-chart-1 text-primary-foreground',
          indicator: 'bg-chart-1',
          border: 'border-chart-1/20'
        };
      case 'en-route':
        return {
          badge: 'bg-chart-2 text-primary-foreground',
          indicator: 'bg-chart-2',
          border: 'border-chart-2/20'
        };
      case 'idle':
        return {
          badge: 'bg-chart-4 text-primary-foreground',
          indicator: 'bg-chart-4',
          border: 'border-chart-4/20'
        };
      case 'offline':
        return {
          badge: 'bg-muted text-muted-foreground',
          indicator: 'bg-muted-foreground',
          border: 'border-muted'
        };
      default:
        return {
          badge: 'bg-primary text-primary-foreground',
          indicator: 'bg-primary',
          border: 'border-primary/20'
        };
    }
  };

  const statusStyle = getStatusStyling(status);

  // Animation variants following established patterns
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

  // Get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role color for crew members
  const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'lead':
        return 'text-chart-1';
      case 'assistant':
        return 'text-chart-2';
      case 'equipment operator':
        return 'text-chart-3';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={cn("w-full", className)}
    >
      <Card className={`bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200 ${statusStyle.border}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                {crew.name}
                <div className={`w-2 h-2 rounded-full ${statusStyle.indicator} shadow-sm`} />
              </CardTitle>
              <CardDescription className="text-sm">
                {crew.specialization}
              </CardDescription>
            </div>
            
            {/* Status Badge and Actions */}
            <div className="flex items-center gap-2">
              <Badge className={`${statusStyle.badge} text-xs font-medium`}>
                {status === 'en-route' ? 'En Route' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Crew Members */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Team Members</h4>
            <div className="flex flex-wrap gap-2">
              {crew.members.map((member: CrewMember) => (
                <div key={member.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                    <p className={`text-xs ${getRoleColor(member.role)}`}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="space-y-3">
            {/* Current Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{currentLocation}</span>
            </div>

            {/* Current Job */}
            {status === 'active' && (
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-1 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground font-medium">{currentJob}</p>
                  <p className="text-muted-foreground text-xs">Est. completion: {estimatedCompletion}</p>
                </div>
              </div>
            )}

            {/* Jobs Completed Today */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">Jobs completed today</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {completedJobs}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Indicator for Offline/Issues */}
          {status === 'offline' && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">Last seen: 45 minutes ago</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CrewCard;
