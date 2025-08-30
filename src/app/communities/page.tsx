"use client";

import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  Clock, 
  UserPlus,
  MessageCircle,
  FileText,
  CheckCircle
} from 'lucide-react';

import { mockSites, mockWorkOrders, mockUsers } from '@/data/mockWorkOrders';

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

const communities = mockSites.map(site => {
  const siteWorkOrders = mockWorkOrders.filter(wo => wo.site_id === site.id);
  const openOrders = siteWorkOrders.filter(wo => wo.status === 'open').length;
  const newOrders = siteWorkOrders.filter(wo => wo.status === 'new').length;
  
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    openOrders,
    newOrders,
    orders: siteWorkOrders.slice(0, 5).map(wo => ({
      id: wo.id,
      title: wo.subject,
      contact: wo.contact?.name || 'Unknown Contact',
      status: wo.status,
      priority: wo.tags.includes('urgent') ? 'high' : wo.tags.includes('maintenance') ? 'medium' : 'low',
      created: formatTimeAgo(wo.created_at),
      assignee: wo.owner_user_id ? mockUsers.find(u => u.id === wo.owner_user_id)?.name || null : null,
    })),
  };
});

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

const WorkOrderRow = ({ order }: { order: { id: string; title: string; contact: string; status: string; priority: string; created: string; assignee: string | null } }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm">{order.title}</span>
        <Badge className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
        <Badge className={getPriorityColor(order.priority)}>
          {order.priority}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {order.contact}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {order.created}
        </div>
        {order.assignee && (
          <div className="flex items-center gap-1">
            <UserPlus className="h-3 w-3" />
            {order.assignee}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {!order.assignee && (
        <Button size="sm" variant="outline">
          <UserPlus className="h-3 w-3 mr-1" />
          Assign
        </Button>
      )}
      <Button size="sm" variant="outline">
        <MessageCircle className="h-3 w-3 mr-1" />
        Reply
      </Button>
      <Button size="sm" variant="outline">
        <FileText className="h-3 w-3 mr-1" />
        Note
      </Button>
      {order.status === 'open' && (
        <Button size="sm" variant="outline">
          <CheckCircle className="h-3 w-3 mr-1" />
          Close
        </Button>
      )}
    </div>
  </div>
);

export default function Communities() {
  return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Communities</h1>
          <p className="text-muted-foreground">
            Manage work orders for communities assigned to you
          </p>
        </div>

        <div className="space-y-6">
          {communities.map((community) => (
            <Card key={community.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {community.name}
                      {community.newOrders > 0 && (
                        <Badge variant="destructive">
                          {community.newOrders} new
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{community.address}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {community.openOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      open orders
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {community.orders.map((order) => (
                    <WorkOrderRow key={order.id} order={order} />
                  ))}
                  {community.orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No open work orders for this community</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {communities.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Communities Assigned</h3>
              <p className="text-muted-foreground">
                You don&apos;t have any communities assigned to manage yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
