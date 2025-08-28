"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, Info, Database, Wifi, Server } from 'lucide-react';

interface SystemStatusProps {
  className?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ className = "" }) => {
  const systemMetrics = [
    { label: 'Database', status: 'online', icon: Database, color: 'text-primary' },
    { label: 'API Services', status: 'online', icon: Server, color: 'text-primary' },
    { label: 'Map Services', status: 'online', icon: Wifi, color: 'text-primary' },
  ];

  const recentActivity = [
    { time: '2 min ago', action: 'Crew Alpha completed job #1247', type: 'success' },
    { time: '5 min ago', action: 'New job ticket created for Green Valley Estates', type: 'info' },
    { time: '12 min ago', action: 'Weather alert: Rain expected after 2 PM', type: 'warning' },
    { time: '18 min ago', action: 'Route optimization completed for Crew Beta', type: 'success' },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          System Status
        </CardTitle>
        <CardDescription>
          Real-time system health and recent activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">System Health</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <div className="space-y-2 sm:space-y-3">
              {systemMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${metric.color}`} />
                      <span className="text-sm sm:text-base font-medium">{metric.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {metric.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All systems operational. Last health check: 30 seconds ago.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-2 sm:space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="mt-0.5">
                  {activity.type === 'success' && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />}
                  {activity.type === 'warning' && <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />}
                  {activity.type === 'info' && <Info className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-card-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
