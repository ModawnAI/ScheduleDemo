"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Calendar,
  Clock,
  MapPin,
  Users,
  Phone,
  Navigation,
  AlertCircle,
  CheckCircle,
  Timer,
  Truck,
  Wrench,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  User,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockCrews, getJobsByDate } from '@/data/mockData';
import { JobTicket } from '@/types';

interface WeeklySchedule {
  date: string;
  dayName: string;
  jobs: JobTicket[];
  totalJobs: number;
  estimatedHours: number;
  status: 'upcoming' | 'today' | 'completed';
}

interface CrewScheduleData {
  crewId: string;
  crewName: string;
  crewLeader: string;
  crewMembers: string[];
  phone: string;
  equipment: string[];
  weeklySchedule: WeeklySchedule[];
}

export default function SchedulePage() {
  const [selectedCrew, setSelectedCrew] = useState<string>('crew-001');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });

  // Generate dates for the current week
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  // Enhanced mock data with more comprehensive job assignments
  const generateEnhancedJobs = (crewName: string, date: Date, dayIndex: number): JobTicket[] => {
    const baseJobs = getJobsByDate(date.toISOString().split('T')[0]).filter(job => job.clientId.includes(crewName.toLowerCase()));
    
    // Additional mock jobs to ensure each day has meaningful data
    const additionalJobs: JobTicket[] = [
      {
        id: `${crewName.toLowerCase().replace(' ', '-')}-${dayIndex}-extra-1`,
        clientId: `client-${dayIndex}-1`,
        address: dayIndex === 0 ? '1245 Medical Dr' : dayIndex === 1 ? '890 Business Blvd' : dayIndex === 2 ? '456 Commerce St' : dayIndex === 3 ? '789 Valley Rd' : dayIndex === 4 ? '321 Innovation Way' : dayIndex === 5 ? '654 Community Ave' : '987 Lakefront Dr',
        lat: 34.0522 + (Math.random() - 0.5) * 0.1,
        long: -118.2437 + (Math.random() - 0.5) * 0.1,
        task: dayIndex % 3 === 0 ? 'Lawn Maintenance' : dayIndex % 3 === 1 ? 'Landscape Installation' : 'Tree & Shrub Care',
        estimatedHours: dayIndex % 2 === 0 ? 2 : 1.5,
        requiredEquipment: ['Standard Equipment'],
        requiredMaterials: ['Standard Materials'],
        serviceType: dayIndex % 3 === 0 ? 'Lawn Maintenance' : dayIndex % 3 === 1 ? 'Landscape Installation' : 'Tree & Shrub Care',
        status: date < new Date() ? 'completed' : date.toDateString() === new Date().toDateString() ? 'in-progress' : 'pending',
        priority: dayIndex === 1 || dayIndex === 4 ? 'high' : dayIndex === 2 ? 'medium' : 'low'
      },
      {
        id: `${crewName.toLowerCase().replace(' ', '-')}-${dayIndex}-extra-2`,
        clientId: `client-${dayIndex}-2`,
        address: dayIndex === 0 ? '2468 Park Ave' : dayIndex === 1 ? '135 Maple St' : dayIndex === 2 ? '579 University Dr' : dayIndex === 3 ? '246 Hillside Ln' : dayIndex === 4 ? '802 Corporate Way' : dayIndex === 5 ? '369 Parkview Rd' : '147 Sunset Blvd',
        lat: 34.0522 + (Math.random() - 0.5) * 0.1,
        long: -118.2437 + (Math.random() - 0.5) * 0.1,
        task: dayIndex % 4 === 0 ? 'Irrigation Repair' : dayIndex % 4 === 1 ? 'Seasonal Cleanup' : dayIndex % 4 === 2 ? 'Fertilization' : 'Pest Control',
        estimatedHours: 2,
        requiredEquipment: ['Standard Equipment'],
        requiredMaterials: ['Standard Materials'],
        serviceType: dayIndex % 4 === 0 ? 'Irrigation Repair' : dayIndex % 4 === 1 ? 'Seasonal Cleanup' : dayIndex % 4 === 2 ? 'Fertilization' : 'Pest Control',
        status: date < new Date() ? 'completed' : date.toDateString() === new Date().toDateString() ? 'pending' : 'pending',
        priority: dayIndex === 3 ? 'high' : 'medium'
      }
    ];

    // Skip weekends for some variety, or add lighter workload
    if (dayIndex === 5 || dayIndex === 6) { // Saturday/Sunday
      return dayIndex === 5 ? [additionalJobs[0]] : []; // Light Saturday work, no Sunday work
    }

    return [...baseJobs, ...additionalJobs];
  };

  // Mock crew schedule data with enhanced job assignments
  const crewScheduleData: CrewScheduleData[] = useMemo(() => [
    {
      crewId: 'crew-001',
      crewName: 'Alpha Team',
      crewLeader: 'Mike Rodriguez',
      crewMembers: ['Jake Thompson', 'Sarah Chen', 'David Wilson'],
      phone: '(555) 123-4567',
      equipment: ['Mower #1', 'Trimmer #3', 'Blower #2', 'Truck #A1'],
      weeklySchedule: weekDates.map((date, index) => {
        const jobs = generateEnhancedJobs('Alpha Team', date, index);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        
        return {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          jobs: jobs,
          totalJobs: jobs.length,
          estimatedHours: jobs.length * 1.8 + Math.random() * 1.5,
          status: isPast ? 'completed' : isToday ? 'today' : 'upcoming'
        };
      })
    },
    {
      crewId: 'crew-002',
      crewName: 'Beta Team',
      crewLeader: 'Lisa Martinez',
      crewMembers: ['Tom Anderson', 'Maria Garcia', 'Chris Johnson'],
      phone: '(555) 234-5678',
      equipment: ['Mower #2', 'Trimmer #1', 'Blower #4', 'Truck #B2'],
      weeklySchedule: weekDates.map((date, index) => {
        const jobs = generateEnhancedJobs('Beta Team', date, index);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        
        return {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          jobs: jobs,
          totalJobs: jobs.length,
          estimatedHours: jobs.length * 1.8 + Math.random() * 1.5,
          status: isPast ? 'completed' : isToday ? 'today' : 'upcoming'
        };
      })
    },
    {
      crewId: 'crew-003',
      crewName: 'Gamma Team',
      crewLeader: 'Robert Kim',
      crewMembers: ['Alex Brown', 'Jennifer Lee', 'Michael Davis'],
      phone: '(555) 345-6789',
      equipment: ['Mower #3', 'Trimmer #2', 'Blower #1', 'Truck #C3'],
      weeklySchedule: weekDates.map((date, index) => {
        const jobs = generateEnhancedJobs('Gamma Team', date, index);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        
        return {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          jobs: jobs,
          totalJobs: jobs.length,
          estimatedHours: jobs.length * 1.8 + Math.random() * 1.5,
          status: isPast ? 'completed' : isToday ? 'today' : 'upcoming'
        };
      })
    },
    {
      crewId: 'crew-004',
      crewName: 'Delta Team',
      crewLeader: 'Amanda Foster',
      crewMembers: ['Ryan Taylor', 'Nicole White', 'Kevin Martinez'],
      phone: '(555) 456-7890',
      equipment: ['Mower #4', 'Trimmer #4', 'Blower #3', 'Truck #D4'],
      weeklySchedule: weekDates.map((date, index) => {
        const jobs = generateEnhancedJobs('Delta Team', date, index);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        
        return {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          jobs: jobs,
          totalJobs: jobs.length,
          estimatedHours: jobs.length * 1.8 + Math.random() * 1.5,
          status: isPast ? 'completed' : isToday ? 'today' : 'upcoming'
        };
      })
    }
  ], [weekDates]);

  const selectedCrewData = crewScheduleData.find(crew => crew.crewId === selectedCrew);

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    setCurrentWeekStart(monday);
  };

  // Get status styling
  const getStatusStyling = (status: WeeklySchedule['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'today':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'upcoming':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: WeeklySchedule['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'today':
        return <Timer className="w-4 h-4 text-blue-600" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Format week range
  const weekRange = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [weekDates]);

  return (
    <div className="w-full bg-background text-foreground">
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Breadcrumb Navigation */}
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
                  <BreadcrumbPage>Crew Schedule</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-chart-1" />
                  Crew Schedule
                </h1>
                <p className="text-muted-foreground mt-1">
                  Weekly schedule view for crew leaders and team members
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={goToCurrentWeek}
                  variant="outline"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Current Week
                </Button>
              </div>
            </div>

            {/* Crew Selection and Week Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Select Crew</label>
                  <Select value={selectedCrew} onValueChange={setSelectedCrew}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Choose crew" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewScheduleData.map((crew) => (
                        <SelectItem key={crew.crewId} value={crew.crewId}>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {crew.crewName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={goToPreviousWeek}
                  variant="outline"
                  size="sm"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="px-4 py-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{weekRange}</span>
                </div>
                
                <Button
                  onClick={goToNextWeek}
                  variant="outline"
                  size="sm"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Crew Information Card */}
            {selectedCrewData && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-chart-2" />
                        {selectedCrewData.crewName}
                      </CardTitle>
                      <CardDescription>
                        Led by {selectedCrewData.crewLeader}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedCrewData.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedCrewData.crewMembers.length + 1} members
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Team Members */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-chart-3" />
                        Team Members
                      </h4>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{selectedCrewData.crewLeader}</span>
                          <Badge variant="outline" className="ml-2 text-xs">Leader</Badge>
                        </div>
                        {selectedCrewData.crewMembers.map((member, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {member}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-chart-4" />
                        Assigned Equipment
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCrewData.equipment.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weekly Schedule Grid - Horizontal Layout */}
            {selectedCrewData && (
              <div className="space-y-4">
                {selectedCrewData.weeklySchedule.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "transition-all duration-200 hover:shadow-md",
                      day.status === 'today' && "ring-2 ring-chart-1 shadow-lg bg-blue-50/30"
                    )}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          
                          {/* Day Header */}
                          <div className="flex-shrink-0 lg:w-48">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-full",
                                day.status === 'today' && "bg-blue-100",
                                day.status === 'completed' && "bg-green-100",
                                day.status === 'upcoming' && "bg-gray-100"
                              )}>
                                {getStatusIcon(day.status)}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-foreground">
                                  {day.dayName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(day.date).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-chart-1" />
                                    <span className="font-medium">{day.totalJobs}</span>
                                    <span>jobs</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 text-chart-2" />
                                    <span className="font-medium">{day.estimatedHours.toFixed(1)}h</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Jobs List - Horizontal */}
                          <div className="flex-1 min-w-0">
                            {day.jobs.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {day.jobs.map((job, jobIndex) => (
                                  <div
                                    key={job.id}
                                    className="p-3 bg-white rounded-lg border border-border/50 hover:shadow-sm transition-all duration-200"
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-foreground truncate">
                                          {job.clientId}
                                        </h4>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {job.address}
                                        </p>
                                      </div>
                                      <Badge 
                                        variant={job.status === 'completed' ? 'default' : 'secondary'}
                                        className="text-xs flex-shrink-0"
                                      >
                                        {job.status === 'completed' ? 'Done' : 
                                         job.status === 'in-progress' ? 'Active' : 'Pending'}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{job.estimatedHours}h</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                          {job.serviceType}
                                        </span>
                                        {job.priority === 'high' && (
                                          <Badge variant="destructive" className="text-xs">
                                            Priority
                                          </Badge>
                                        )}
                                      </div>
                                      {job.estimatedHours && (
                                        <div className="text-xs text-chart-3 font-medium">
                                          {job.estimatedHours}h
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                                <div className="text-center">
                                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm font-medium">No jobs scheduled</p>
                                  <p className="text-xs">Day off</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0 lg:w-32">
                            <div className="flex flex-col gap-2">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "justify-center text-xs font-medium",
                                  day.status === 'today' && "bg-blue-100 text-blue-800 border-blue-300",
                                  day.status === 'completed' && "bg-green-100 text-green-800 border-green-300",
                                  day.status === 'upcoming' && "bg-gray-100 text-gray-700 border-gray-300"
                                )}
                              >
                                {day.status === 'today' ? 'Today' : 
                                 day.status === 'completed' ? 'Completed' : 'Upcoming'}
                              </Badge>
                              
                              {day.status === 'today' && day.jobs.length > 0 && (
                                <Button
                                  size="sm"
                                  className="w-full bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                                >
                                  <Navigation className="w-4 h-4 mr-1" />
                                  Start Route
                                </Button>
                              )}
                              
                              {day.status === 'completed' && day.jobs.length > 0 && (
                                <div className="text-center text-xs text-green-700 font-medium p-2 bg-green-50 rounded">
                                  ✓ Complete
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Weekly Summary */}
            {selectedCrewData && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-chart-3" />
                    Weekly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-chart-1">
                        {selectedCrewData.weeklySchedule.reduce((sum, day) => sum + day.totalJobs, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Jobs</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-chart-2">
                        {selectedCrewData.weeklySchedule.reduce((sum, day) => sum + day.estimatedHours, 0).toFixed(1)}h
                      </div>
                      <div className="text-xs text-muted-foreground">Est. Hours</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-chart-3">
                        {selectedCrewData.weeklySchedule.filter(day => day.status === 'completed').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Days Complete</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-chart-4">
                        {selectedCrewData.weeklySchedule.filter(day => day.totalJobs > 0).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Active Days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
}
