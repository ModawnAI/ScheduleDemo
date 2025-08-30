"use client";

import React, { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Building2,
  Plus,
  Eye,
  Edit3
} from 'lucide-react';

import { getWorkOrderStats, mockWorkOrders } from '@/data/mockWorkOrders';
import { CreateWorkOrderModal, WorkOrderDetail, WorkOrderFilters, WorkOrderAnalytics } from '@/components/work-orders';

// Helper function to format time ago
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
};

const stats = [
  {
    name: 'Open Work Orders',
    value: getWorkOrderStats().open.toString(),
    change: '+12%',
    changeType: 'increase' as const,
    icon: Inbox,
  },
  {
    name: 'Avg Response Time',
    value: '2.4h',
    change: '-8%',
    changeType: 'decrease' as const,
    icon: Clock,
  },
  {
    name: 'Completed Today',
    value: '8',
    change: '+23%',
    changeType: 'increase' as const,
    icon: CheckCircle,
  },
  {
    name: 'Overdue',
    value: '3',
    change: '-2',
    changeType: 'decrease' as const,
    icon: AlertTriangle,
  },
];

const recentWorkOrders = mockWorkOrders.slice(0, 3).map(wo => ({
  id: wo.id,
  title: wo.subject,
  site: wo.site?.name || 'Unknown Site',
  contact: wo.contact?.name || 'Unknown Contact',
  status: wo.status,
  priority: wo.tags.includes('urgent') ? 'high' : wo.tags.includes('maintenance') ? 'medium' : 'low',
  created: formatTimeAgo(wo.created_at),
}));

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'open':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function Dashboard() {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<typeof mockWorkOrders[0] | null>(null);
  const [showWorkOrderDetail, setShowWorkOrderDetail] = useState(false);
  const [workOrders, setWorkOrders] = useState(mockWorkOrders);
  const [filters, setFilters] = useState({
    search: '',
    status: [] as string[],
    priority: [] as string[],
    site: [] as string[],
    assignee: [] as string[],
    tags: [] as string[],
    dateRange: 'all',
  });

  const handleWorkOrderCreated = (newWorkOrder: typeof mockWorkOrders[0]) => {
    setWorkOrders(prev => [newWorkOrder, ...prev]);
  };

  const handleWorkOrderUpdated = (updatedWorkOrder: typeof mockWorkOrders[0]) => {
    setWorkOrders(prev => prev.map(wo => wo.id === updatedWorkOrder.id ? updatedWorkOrder : wo));
  };

  const handleWorkOrderClick = (workOrder: typeof mockWorkOrders[0]) => {
    setSelectedWorkOrder(workOrder);
    setShowWorkOrderDetail(true);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: [],
      priority: [],
      site: [],
      assignee: [],
      tags: [],
      dateRange: 'all',
    });
  };

  // Apply filters to work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    if (filters.search && !wo.subject.toLowerCase().includes(filters.search.toLowerCase()) && 
        !wo.body.toLowerCase().includes(filters.search.toLowerCase()) && 
        !wo.id.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(wo.status)) {
      return false;
    }
    if (filters.priority.length > 0) {
      const priority = wo.tags.includes('urgent') ? 'urgent' : wo.tags.includes('high') ? 'high' : wo.tags.includes('medium') ? 'medium' : 'low';
      if (!filters.priority.includes(priority)) {
        return false;
      }
    }
    if (filters.site.length > 0 && !filters.site.includes(wo.site_id)) {
      return false;
    }
    if (filters.assignee.length > 0) {
      if (filters.assignee.includes('unassigned') && wo.owner_user_id) {
        return false;
      }
      if (!filters.assignee.includes('unassigned') && !filters.assignee.includes(wo.owner_user_id || '')) {
        return false;
      }
    }
    if (filters.tags.length > 0 && !filters.tags.some(tag => wo.tags.includes(tag))) {
      return false;
    }
    return true;
  });

  return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Work Order Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track all customer work orders in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.name}
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                        <span className="sr-only">
                          {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Work Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Work Orders</CardTitle>
                  <CardDescription>
                    Latest work orders requiring attention
                  </CardDescription>
                </div>
                <CreateWorkOrderModal onWorkOrderCreated={handleWorkOrderCreated} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentWorkOrders.map((order) => {
                  const workOrder = workOrders.find(wo => wo.id === order.id);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => workOrder && handleWorkOrderClick(workOrder)}
                    >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {order.title}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {order.site}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {order.contact}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.created}
                    </div>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Create Work Order
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Inbox className="h-6 w-6 mb-2" />
                  View All Orders
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Teams
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Building2 className="h-6 w-6 mb-2" />
                  Site Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <WorkOrderAnalytics className="mt-8" />

        {/* Work Order Detail Modal */}
        {showWorkOrderDetail && selectedWorkOrder && (
          <WorkOrderDetail
            workOrder={selectedWorkOrder}
            onWorkOrderUpdated={handleWorkOrderUpdated}
            onClose={() => setShowWorkOrderDetail(false)}
          />
        )}
      </div>
  );
}