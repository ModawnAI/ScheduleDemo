"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MapPin, Clock, Settings, UserPlus, Calendar } from "lucide-react";

export default function CrewsPage() {
  const crews = [
    {
      id: 1,
      name: "Alpha Team",
      leader: "Mike Johnson",
      members: ["Sarah Connor", "James Wilson"],
      specialization: "Mowing & Maintenance",
      status: "active",
      currentJob: "Sunset Plaza - Weekly Mowing",
      location: "West Hollywood",
      efficiency: 96
    },
    {
      id: 2,
      name: "Beta Team", 
      leader: "Carlos Rodriguez",
      members: ["Lisa Park", "David Kim", "Anna Martinez"],
      specialization: "Landscaping & Design",
      status: "active",
      currentJob: "Medical Center - Garden Maintenance",
      location: "Downtown LA",
      efficiency: 92
    },
    {
      id: 3,
      name: "Gamma Team",
      leader: "Tom Bradley",
      members: ["Jessica Brown"],
      specialization: "Tree Care & Pruning",
      status: "available",
      currentJob: null,
      location: "Equipment Yard",
      efficiency: 89
    },
    {
      id: 4,
      name: "Delta Team",
      leader: "Maria Garcia",
      members: ["Robert Lee", "Susan Davis"],
      specialization: "Irrigation & Repair",
      status: "maintenance",
      currentJob: "Equipment Service",
      location: "Service Center",
      efficiency: 94
    }
  ];

  return (
    <div className="w-full bg-background">
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Crew Management
                </h1>
                <p className="text-sm sm:text-lg text-muted-foreground">
                  Manage crew assignments, schedules, and performance tracking
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Crew Member
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule View
                </Button>
              </div>
            </div>

            {/* Crew Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Crews</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-2xl font-bold text-foreground">4</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Active Crews</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-2xl font-bold text-primary">2</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-2xl font-bold text-foreground">12</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-2xl font-bold text-foreground">93%</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Crew Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crews.map((crew) => (
                <Card key={crew.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {crew.name}
                        </CardTitle>
                        <CardDescription>{crew.specialization}</CardDescription>
                      </div>
                      <Badge 
                        variant={
                          crew.status === 'active' ? 'default' :
                          crew.status === 'available' ? 'secondary' : 'outline'
                        }
                      >
                        {crew.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Crew Leader */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {crew.leader.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Team Leader: {crew.leader}</p>
                        <p className="text-xs text-muted-foreground">
                          {crew.members.length} additional member{crew.members.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Current Status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{crew.location}</span>
                      </div>
                      
                      {crew.currentJob && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{crew.currentJob}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Efficiency Rating:</span>
                        <span className="font-medium text-primary">{crew.efficiency}%</span>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Team Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {crew.members.map((member) => (
                          <Badge key={member} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        Track
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </div>
  );
}