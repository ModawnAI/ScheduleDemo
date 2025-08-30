"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  FileText, 
  MapPin, 
  User, 
  Clock, 
  Building2, 
  Calendar,
  Phone,
  Mail,
  Edit3,
  CheckCircle,
  X,
  RotateCcw,
  Paperclip,
  Send,
  History,
  AlertTriangle
} from 'lucide-react';
import { mockUsers, mockWorkOrderMessages } from '@/data/mockWorkOrders';
import { WorkOrder } from '@/types/work-orders';

interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onWorkOrderUpdated: (workOrder: WorkOrder) => void;
  onClose: () => void;
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'open', label: 'Open', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'closed', label: 'Closed', color: 'bg-green-100 text-green-800 border-green-200' },
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'urgent', label: 'Urgent', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

export default function WorkOrderDetail({ workOrder, onWorkOrderUpdated, onClose }: WorkOrderDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    subject: string;
    body: string;
    status: 'new' | 'open' | 'closed';
    priority: string;
    estimatedHours: string;
  }>({
    subject: workOrder.subject,
    body: workOrder.body,
    status: workOrder.status,
    priority: workOrder.tags.includes('urgent') ? 'urgent' : workOrder.tags.includes('maintenance') ? 'medium' : 'low',
    estimatedHours: workOrder.estimated_hours?.toString() || '',
  });

  const handleStatusChange = (newStatus: 'new' | 'open' | 'closed') => {
    const updatedWorkOrder = {
      ...workOrder,
      status: newStatus,
      updated_at: new Date(),
      last_activity: new Date(),
    };
    onWorkOrderUpdated(updatedWorkOrder);
  };

  const handlePriorityChange = (newPriority: string) => {
    const updatedWorkOrder = {
      ...workOrder,
      tags: workOrder.tags.filter((tag: string) => !['urgent', 'high', 'medium', 'low'].includes(tag)).concat([newPriority]),
      updated_at: new Date(),
    };
    onWorkOrderUpdated(updatedWorkOrder);
  };

  const handleAssignUser = (userId: string) => {
    const updatedWorkOrder = {
      ...workOrder,
      owner_user_id: userId,
      updated_at: new Date(),
      last_activity: new Date(),
    };
    onWorkOrderUpdated(updatedWorkOrder);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      work_order_id: workOrder.id,
      sender: 'staff' as const,
      visibility: 'public' as const,
      body: newMessage,
      attachments: [],
      created_at: new Date(),
    };

    // In a real app, this would be sent to the backend
    console.log('New message:', message);
    
    const updatedWorkOrder = {
      ...workOrder,
      last_activity: new Date(),
      updated_at: new Date(),
    };
    onWorkOrderUpdated(updatedWorkOrder);
    
    setNewMessage('');
  };

  const handleSaveEdit = () => {
    const updatedWorkOrder = {
      ...workOrder,
      subject: editData.subject,
      body: editData.body,
      status: editData.status,
      tags: workOrder.tags.filter((tag: string) => !['urgent', 'high', 'medium', 'low'].includes(tag)).concat([editData.priority]),
      estimated_hours: editData.estimatedHours ? parseInt(editData.estimatedHours) : undefined,
      updated_at: new Date(),
    };
    onWorkOrderUpdated(updatedWorkOrder);
    setIsEditing(false);
  };

  const getPriorityFromTags = () => {
    if (workOrder.tags.includes('urgent')) return 'urgent';
    if (workOrder.tags.includes('high')) return 'high';
    if (workOrder.tags.includes('medium')) return 'medium';
    return 'low';
  };

  const assignedUser = workOrder.owner_user_id ? mockUsers.find(u => u.id === workOrder.owner_user_id) : null;
  const workOrderMessages = mockWorkOrderMessages.filter(msg => msg.work_order_id === workOrder.id);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{workOrder.subject}</DialogTitle>
              <DialogDescription>
                Work Order #{workOrder.id} • {workOrder.site?.name}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusOptions.find(s => s.value === workOrder.status)?.color}>
                {workOrder.status}
              </Badge>
              <Badge className={priorityOptions.find(p => p.value === getPriorityFromTags())?.color}>
                {getPriorityFromTags()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="attachments">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Work Order Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Work Order Details
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          value={editData.subject}
                          onChange={(e) => setEditData(prev => ({ ...prev, subject: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={editData.body}
                          onChange={(e) => setEditData(prev => ({ ...prev, body: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value as 'new' | 'open' | 'closed' }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <Badge className={option.color}>{option.label}</Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Priority</label>
                          <Select value={editData.priority} onValueChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <Badge className={option.color}>{option.label}</Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Estimated Hours</label>
                        <Input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={editData.estimatedHours}
                          onChange={(e) => setEditData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                          placeholder="e.g., 4.5"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Subject</label>
                        <p className="font-medium">{workOrder.subject}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-sm">{workOrder.body}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Select value={workOrder.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <Badge className={option.color}>{option.label}</Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Priority</label>
                          <Select value={getPriorityFromTags()} onValueChange={handlePriorityChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <Badge className={option.color}>{option.label}</Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {workOrder.estimated_hours && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Estimated Hours</label>
                          <p className="font-medium">{workOrder.estimated_hours} hours</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {workOrder.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Site & Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Site & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Site</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{workOrder.site?.name}</p>
                        <p className="text-sm text-muted-foreground">{workOrder.site?.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{workOrder.contact?.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {workOrder.contact?.email}
                          </span>
                          {workOrder.contact?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {workOrder.contact?.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                    <div className="flex items-center gap-2 mt-1">
                      {assignedUser ? (
                        <>
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{assignedUser.name}</span>
                          <Badge variant="outline">{assignedUser.role}</Badge>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                    <Select value={workOrder.owner_user_id || ''} onValueChange={handleAssignUser}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Assign to user..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {user.name} ({user.role})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Work order created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(workOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {workOrder.owner_user_id && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Assigned to {assignedUser?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(workOrder.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {workOrder.reopen_count > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Reopened {workOrder.reopen_count} time(s)</p>
                        <p className="text-xs text-muted-foreground">
                          Last reopened: {new Date(workOrder.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages ({workOrderMessages.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Message List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {workOrderMessages.map((message) => (
                    <div key={message.id} className={`p-3 rounded-lg border ${
                      message.sender === 'customer' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={message.sender === 'customer' ? 'default' : 'secondary'}>
                            {message.sender === 'customer' ? 'Customer' : 'Staff'}
                          </Badge>
                          {message.visibility === 'internal' && (
                            <Badge variant="outline">Internal</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.body}</p>
                    </div>
                  ))}
                </div>

                {/* New Message */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Work order created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(workOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {workOrder.owner_user_id && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Assigned to {assignedUser?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(workOrder.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {workOrder.reopen_count > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Reopened {workOrder.reopen_count} time(s)</p>
                        <p className="text-xs text-muted-foreground">
                          Last reopened: {new Date(workOrder.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {workOrderMessages.map((message) => (
                    <div key={message.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {message.sender === 'customer' ? 'Customer message' : 'Staff message'} added
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No attachments yet</p>
                  <p className="text-sm">Upload photos, documents, or other files related to this work order</p>
                  <Button className="mt-4" variant="outline">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
