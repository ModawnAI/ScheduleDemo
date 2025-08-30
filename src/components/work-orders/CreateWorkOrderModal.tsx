"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, User, Building2, AlertTriangle, Clock, FileText } from 'lucide-react';
import { mockSites, mockContacts, mockUsers } from '@/data/mockWorkOrders';
import { WorkOrder } from '@/types/work-orders';

interface CreateWorkOrderModalProps {
  onWorkOrderCreated: (workOrder: WorkOrder) => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'urgent', label: 'Urgent', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

const tagOptions = [
  'irrigation', 'landscaping', 'maintenance', 'repair', 'cleaning', 'pest-control',
  'tree-service', 'lawn-care', 'pool', 'gate', 'emergency', 'scheduled'
];

export default function CreateWorkOrderModal({ onWorkOrderCreated }: CreateWorkOrderModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    siteId: '',
    contactId: '',
    priority: 'medium',
    tags: [] as string[],
    externalRef: '',
    estimatedHours: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.body.trim()) newErrors.body = 'Description is required';
    if (!formData.siteId) newErrors.siteId = 'Site selection is required';
    if (!formData.contactId) newErrors.contactId = 'Contact selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newWorkOrder = {
      id: `WO-${Date.now()}`,
      status: 'new' as const,
      site_id: formData.siteId,
      customer_id: `customer-${Date.now()}`,
      contact_id: formData.contactId,
      owner_user_id: undefined,
      tags: formData.tags,
      external_ref: formData.externalRef || undefined,
      subject: formData.subject,
      body: formData.body,
      last_activity: new Date(),
      reopen_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      estimated_hours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      site: mockSites.find(s => s.id === formData.siteId),
      contact: mockContacts.find(c => c.id === formData.contactId),
    };

    onWorkOrderCreated(newWorkOrder);
    setOpen(false);
    setFormData({
      subject: '',
      body: '',
      siteId: '',
      contactId: '',
      priority: 'medium',
      tags: [],
      externalRef: '',
      estimatedHours: '',
    });
    setErrors({});
  };

  const selectedSite = mockSites.find(s => s.id === formData.siteId);
  const selectedContact = mockContacts.find(c => c.id === formData.contactId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new work order for your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief description of the work needed"
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalRef">External Reference</Label>
              <Input
                id="externalRef"
                value={formData.externalRef}
                onChange={(e) => handleInputChange('externalRef', e.target.value)}
                placeholder="Customer reference number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Detailed Description *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              placeholder="Provide detailed information about the work required..."
              rows={4}
              className={errors.body ? 'border-red-500' : ''}
            />
            {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
          </div>

          {/* Site and Contact Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site">Site *</Label>
              <Select value={formData.siteId} onValueChange={(value) => handleInputChange('siteId', value)}>
                <SelectTrigger className={errors.siteId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {mockSites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {site.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.siteId && <p className="text-sm text-red-500">{errors.siteId}</p>}
              
              {selectedSite && (
                <Card className="mt-2">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {selectedSite.address}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person *</Label>
              <Select value={formData.contactId} onValueChange={(value) => handleInputChange('contactId', value)}>
                <SelectTrigger className={errors.contactId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {mockContacts
                    .filter(contact => !formData.siteId || contact.site_id === formData.siteId)
                    .map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {contact.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.contactId && <p className="text-sm text-red-500">{errors.contactId}</p>}
              
              {selectedContact && (
                <Card className="mt-2">
                  <CardContent className="p-3">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {selectedContact.email}
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {selectedContact.phone}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Priority and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={option.color}>
                          {option.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                placeholder="e.g., 4.5"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                    formData.tags.includes(tag) ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.subject && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Work Order Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className={priorityOptions.find(p => p.value === formData.priority)?.color}>
                      {formData.priority}
                    </Badge>
                    {formData.tags.length > 0 && (
                      <div className="flex gap-1">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-medium">{formData.subject}</p>
                  <p className="text-muted-foreground line-clamp-2">{formData.body}</p>
                  {selectedSite && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {selectedSite.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Work Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
