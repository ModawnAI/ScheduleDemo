"use client";

import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  MessageSquare, 
  Paperclip,
  Building2,
  User,
  Calendar,
  RotateCcw
} from 'lucide-react';

import { mockWorkOrders, mockWorkOrderMessages } from '@/data/mockWorkOrders';

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

const newlyAssigned = mockWorkOrders
  .filter(wo => wo.status === 'new' && !wo.owner_user_id)
  .slice(0, 3)
  .map(wo => ({
    id: wo.id,
    title: wo.subject,
    site: wo.site?.name || 'Unknown Site',
    contact: wo.contact?.name || 'Unknown Contact',
    priority: wo.tags.includes('urgent') ? 'high' : wo.tags.includes('maintenance') ? 'medium' : 'low',
    assigned: formatTimeAgo(wo.created_at),
    messages: mockWorkOrderMessages.filter(msg => msg.work_order_id === wo.id).length,
    attachments: 0, // Mock data doesn't have attachments yet
  }));

const reopened = mockWorkOrders
  .filter(wo => wo.reopen_count > 0 && wo.owner_user_id)
  .slice(0, 3)
  .map(wo => ({
    id: wo.id,
    title: wo.subject,
    site: wo.site?.name || 'Unknown Site',
    contact: wo.contact?.name || 'Unknown Contact',
    priority: wo.tags.includes('urgent') ? 'high' : wo.tags.includes('maintenance') ? 'medium' : 'low',
    reopened: formatTimeAgo(wo.updated_at),
    reopenCount: wo.reopen_count,
    messages: mockWorkOrderMessages.filter(msg => msg.work_order_id === wo.id).length,
    attachments: 0,
  }));

const allOpen = mockWorkOrders
  .filter(wo => wo.status === 'open' && wo.owner_user_id)
  .slice(0, 5)
  .map(wo => ({
    id: wo.id,
    title: wo.subject,
    site: wo.site?.name || 'Unknown Site',
    contact: wo.contact?.name || 'Unknown Contact',
    priority: wo.tags.includes('urgent') ? 'high' : wo.tags.includes('maintenance') ? 'medium' : 'low',
    lastActivity: formatTimeAgo(wo.last_activity),
    messages: mockWorkOrderMessages.filter(msg => msg.work_order_id === wo.id).length,
    attachments: 0,
  }));

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

const WorkOrderCard = ({ order, showReopenBadge = false }: { order: { id: string; title: string; site: string; contact: string; priority: string; assigned?: string; reopened?: string; lastActivity?: string; messages: number; attachments: number; reopenCount?: number }; showReopenBadge?: boolean }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{order.title}</h3>
            <Badge className={getPriorityColor(order.priority)}>
              {order.priority}
            </Badge>
            {showReopenBadge && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                Reopened
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {order.site}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {order.contact}
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {order.id}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {order.assigned || order.reopened || order.lastActivity}
          </div>
          {order.messages > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {order.messages}
            </div>
          )}
          {order.attachments > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {order.attachments}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Reply
          </Button>
          <Button size="sm">
            View
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function MyWork() {
  return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Work</h1>
          <p className="text-muted-foreground">
            Work orders assigned to you and requiring your attention
          </p>
        </div>

        <Tabs defaultValue="newly-assigned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="newly-assigned" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Newly Assigned
              <Badge variant="secondary">{newlyAssigned.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reopened" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reopened to Me
              <Badge variant="destructive">{reopened.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all-open" className="flex items-center gap-2">
              All Open Assigned to Me
              <Badge variant="outline">{allOpen.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="newly-assigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newly Assigned Work Orders</CardTitle>
                <CardDescription>
                  Work orders recently assigned to you that need immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {newlyAssigned.length > 0 ? (
                  newlyAssigned.map((order) => (
                    <WorkOrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No newly assigned work orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reopened" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reopened Work Orders</CardTitle>
                <CardDescription>
                  Work orders that were closed but have been reopened due to customer responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reopened.length > 0 ? (
                  reopened.map((order) => (
                    <WorkOrderCard key={order.id} order={order} showReopenBadge />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reopened work orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-open" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Open Work Orders</CardTitle>
                <CardDescription>
                  All work orders currently assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {allOpen.length > 0 ? (
                  allOpen.map((order) => (
                    <WorkOrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No open work orders assigned to you</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
