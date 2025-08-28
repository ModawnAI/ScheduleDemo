"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  Route,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockCrews, mockJobTickets } from '@/data/mockData';
import CrewCard from './CrewCard';
import JobCard from './JobCard';
import MetricsPanel from './MetricsPanel';
import RouteMap from './RouteMap';

interface DailyDashboardProps {
  className?: string;
}

const DailyDashboard: React.FC<DailyDashboardProps> = ({ className }) => {
  // Animation variants following established patterns
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

  return (
    <div className={cn("w-full bg-background text-foreground font-sans", className)}>
      {/* Main Content Container with Mandatory Configuration Standards */}
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
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Daily Mission Control</h1>
                <p className="text-muted-foreground">
                  Today&apos;s operations overview - {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {/* Status Badge */}
              <motion.div variants={itemVariants}>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Operations Active
                </Badge>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            >
              {[
                { icon: Calendar, label: "Today's Jobs", value: "12", color: "text-chart-1" },
                { icon: Users, label: "Active Crews", value: "4", color: "text-chart-2" },
                { icon: CheckCircle, label: "Completed", value: "8", color: "text-chart-3" },
                { icon: Route, label: "Routes", value: "3", color: "text-chart-4" }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  whileHover="hover"
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
            className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          >
            
            {/* Left Column - Primary Content */}
            <div className="xl:col-span-2 space-y-4 md:space-y-6">
              
              {/* Crew Status Cards Placeholder */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <Users className="w-5 h-5 text-primary" />
                      Active Crews
                    </CardTitle>
                    <CardDescription>Real-time crew status and assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Active CrewCard components */}
                      {mockCrews.map((crew, index) => {
                        // Simulate different crew statuses
                        const statuses = ['active', 'en-route', 'idle', 'offline'] as const;
                        const currentJobs = [
                          'Weekly Mowing - Sunset Plaza',
                          'Hedge Trimming - Oak Valley',
                          'Fertilization - Pine Ridge',
                          'Tree Pruning - Maple Heights'
                        ];
                        const locations = [
                          'Downtown Area',
                          'Northside District', 
                          'Westfield Zone',
                          'Southgate Region'
                        ];
                        
                        return (
                          <motion.div
                            key={crew.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <CrewCard
                              crew={crew}
                              status={statuses[index % statuses.length]}
                              currentLocation={locations[index % locations.length]}
                              currentJob={currentJobs[index % currentJobs.length]}
                              completedJobs={Math.floor(Math.random() * 5) + 1}
                              estimatedCompletion={`${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Job Timeline Placeholder */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      Job Timeline
                    </CardTitle>
                    <CardDescription>Today&apos;s scheduled services and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Active JobCard components */}
                      {mockJobTickets.slice(0, 4).map((job, index) => {
                        // Simulate different job statuses and crew assignments
                        const crews = ['Alpha Team', 'Bravo Team', 'Charlie Team', 'Delta Team'];
                        const arrivals = ['9:30 AM', '11:00 AM', '1:30 PM', '3:00 PM'];
                        const completions = ['11:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'];
                        
                        return (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <JobCard
                              job={job}
                              estimatedArrival={arrivals[index]}
                              estimatedCompletion={completions[index]}
                              crewAssigned={crews[index % crews.length]}
                              isActive={index === 0} // First job is active
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Metrics and Map */}
            <div className="xl:col-span-1 space-y-4 md:space-y-6">
              
              {/* Metrics Panel Placeholder */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>Daily performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetricsPanel />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interactive Map with Mapbox */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <MapPin className="w-5 h-5 text-primary" />
                      Route Overview
                    </CardTitle>
                    <CardDescription>Live crew locations and routes</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-square sm:aspect-video lg:aspect-square">
                      <RouteMap 
                        selectedDate="2024-09-16"
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <Activity className="w-5 h-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                    >
                      <Route className="w-4 h-4 mr-2" />
                      Optimize Routes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DailyDashboard;
