"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Building2,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { mockWorkOrders, mockSites, mockUsers, getWorkOrderStats } from '@/data/mockWorkOrders';

interface WorkOrderAnalyticsProps {
  className?: string;
}

export default function WorkOrderAnalytics({ className }: WorkOrderAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedSite, setSelectedSite] = useState('all');
  const [stats, setStats] = useState(getWorkOrderStats());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getWorkOrderStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getPriorityFromTags = (tags: string[]) => {
    if (tags.includes('urgent')) return 'urgent';
    if (tags.includes('high')) return 'high';
    if (tags.includes('medium')) return 'medium';
    return 'low';
  };

  const getFilteredWorkOrders = () => {
    let filtered = mockWorkOrders;
    
    if (selectedSite !== 'all') {
      filtered = filtered.filter(wo => wo.site_id === selectedSite);
    }
    
    // Filter by time range (simplified for demo)
    const now = new Date();
    if (timeRange === 'today') {
      filtered = filtered.filter(wo => {
        const createdDate = new Date(wo.created_at);
        return createdDate.toDateString() === now.toDateString();
      });
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(wo => new Date(wo.created_at) >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(wo => new Date(wo.created_at) >= monthAgo);
    }
    
    return filtered;
  };

  const filteredWorkOrders = getFilteredWorkOrders();

  // Calculate analytics
  const analytics = {
    total: filteredWorkOrders.length,
    byStatus: {
      new: filteredWorkOrders.filter(wo => wo.status === 'new').length,
      open: filteredWorkOrders.filter(wo => wo.status === 'open').length,
      closed: filteredWorkOrders.filter(wo => wo.status === 'closed').length,
    },
    byPriority: {
      urgent: filteredWorkOrders.filter(wo => getPriorityFromTags(wo.tags) === 'urgent').length,
      high: filteredWorkOrders.filter(wo => getPriorityFromTags(wo.tags) === 'high').length,
      medium: filteredWorkOrders.filter(wo => getPriorityFromTags(wo.tags) === 'medium').length,
      low: filteredWorkOrders.filter(wo => getPriorityFromTags(wo.tags) === 'low').length,
    },
    bySite: mockSites.map(site => ({
      name: site.name,
      count: filteredWorkOrders.filter(wo => wo.site_id === site.id).length,
      open: filteredWorkOrders.filter(wo => wo.site_id === site.id && wo.status === 'open').length,
      new: filteredWorkOrders.filter(wo => wo.site_id === site.id && wo.status === 'new').length,
    })),
    byAssignee: mockUsers.map(user => ({
      name: user.name,
      role: user.role,
      assigned: filteredWorkOrders.filter(wo => wo.owner_user_id === user.id).length,
      open: filteredWorkOrders.filter(wo => wo.owner_user_id === user.id && wo.status === 'open').length,
    })),
    responseTime: {
      average: 2.4, // Mock data
      trend: -0.3,
      improvement: true,
    },
    completionRate: {
      current: 78.5, // Mock data
      trend: 2.1,
      improvement: true,
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {mockSites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === 'today' ? 'Created today' : 
               timeRange === 'week' ? 'This week' : 
               timeRange === 'month' ? 'This month' : 'This quarter'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.byStatus.open}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.byStatus.open > 0 ? 'Requires attention' : 'All caught up!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.responseTime.average}h</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.responseTime.improvement ? (
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
              )}
              {analytics.responseTime.trend}h from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate.current}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.completionRate.improvement ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              +{analytics.completionRate.trend}% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{count}</div>
                        <div className="text-xs text-muted-foreground">
                          {analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.byPriority).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(priority)}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{count}</div>
                        <div className="text-xs text-muted-foreground">
                          {analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredWorkOrders.slice(0, 5).map((workOrder) => (
                  <div key={workOrder.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">{workOrder.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {workOrder.site?.name} • {workOrder.contact?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(workOrder.status)}>
                        {workOrder.status}
                      </Badge>
                      <Badge className={getPriorityColor(getPriorityFromTags(workOrder.tags))}>
                        {getPriorityFromTags(workOrder.tags)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(workOrder.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.bySite.map((site) => (
              <Card key={site.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" />
                    {site.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{site.new}</div>
                      <div className="text-xs text-muted-foreground">New</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{site.open}</div>
                      <div className="text-xs text-muted-foreground">Open</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{site.count}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.byAssignee.map((member) => (
              <Card key={member.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    {member.name}
                  </CardTitle>
                  <Badge variant="outline">{member.role}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{member.assigned}</div>
                      <div className="text-xs text-muted-foreground">Assigned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{member.open}</div>
                      <div className="text-xs text-muted-foreground">Open</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      {member.assigned > 0 ? Math.round((member.open / member.assigned) * 100) : 0}% still open
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {analytics.responseTime.trend > 0 ? '+' : ''}{analytics.responseTime.trend}h
                  </div>
                  <div className="text-sm text-muted-foreground">Response Time Change</div>
                  <div className="text-xs text-green-600">Improving</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    +{analytics.completionRate.trend}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate Change</div>
                  <div className="text-xs text-green-600">Improving</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Orders This Period</div>
                  <div className="text-xs text-blue-600">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
