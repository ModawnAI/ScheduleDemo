"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  User, 
  Calendar,
  Clock,
  Building2,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { mockSites, mockUsers } from '@/data/mockWorkOrders';

interface WorkOrderFiltersProps {
  filters: {
    search: string;
    status: string[];
    priority: string[];
    site: string[];
    assignee: string[];
    tags: string[];
    dateRange: string;
  };
  onFiltersChange: (filters: {
    search: string;
    status: string[];
    priority: string[];
    site: string[];
    assignee: string[];
    tags: string[];
    dateRange: string;
  }) => void;
  onClearFilters: () => void;
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

const tagOptions = [
  'irrigation', 'landscaping', 'maintenance', 'repair', 'cleaning', 'pest-control',
  'tree-service', 'lawn-care', 'pool', 'gate', 'emergency', 'scheduled'
];

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
];

export default function WorkOrderFilters({ filters, onFiltersChange, onClearFilters }: WorkOrderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const handleArrayFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    const currentValues = filters[filterType] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    handleFilterChange(filterType, newValues);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== 'all'
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.site.length > 0) count++;
    if (filters.assignee.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search work orders by subject, description, or ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  handleFilterChange('status', []);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {filters.status.length === 0 
                    ? 'All Statuses' 
                    : `${filters.status.length} selected`
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={option.color}>{option.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={filters.priority.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  handleFilterChange('priority', []);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {filters.priority.length === 0 
                    ? 'All Priorities' 
                    : `${filters.priority.length} selected`
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={option.color}>{option.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Site</label>
            <Select
              value={filters.site.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  handleFilterChange('site', []);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {filters.site.length === 0 
                    ? 'All Sites' 
                    : `${filters.site.length} selected`
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${option.value}`}
                        checked={filters.status.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('status', option.value, checked as boolean)
                        }
                      />
                      <label htmlFor={`status-${option.value}`} className="text-sm">
                        <Badge className={option.color}>{option.label}</Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Priority
                </label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${option.value}`}
                        checked={filters.priority.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('priority', option.value, checked as boolean)
                        }
                      />
                      <label htmlFor={`priority-${option.value}`} className="text-sm">
                        <Badge className={option.color}>{option.label}</Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Sites
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mockSites.map((site) => (
                    <div key={site.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`site-${site.id}`}
                        checked={filters.site.includes(site.id)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('site', site.id, checked as boolean)
                        }
                      />
                      <label htmlFor={`site-${site.id}`} className="text-sm">
                        {site.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignee Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignees
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="assignee-unassigned"
                      checked={filters.assignee.includes('unassigned')}
                      onCheckedChange={(checked) => 
                        handleArrayFilterChange('assignee', 'unassigned', checked as boolean)
                      }
                    />
                    <label htmlFor="assignee-unassigned" className="text-sm">
                      Unassigned
                    </label>
                  </div>
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`assignee-${user.id}`}
                        checked={filters.assignee.includes(user.id)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('assignee', user.id, checked as boolean)
                        }
                      />
                      <label htmlFor={`assignee-${user.id}`} className="text-sm">
                        {user.name} ({user.role})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                      filters.tags.includes(tag) ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => {
                      const checked = !filters.tags.includes(tag);
                      handleArrayFilterChange('tags', tag, checked);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: &quot;{filters.search}&quot;
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('search', '')}
                  />
                </Badge>
              )}
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="flex items-center gap-1">
                  Status: {statusOptions.find(s => s.value === status)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleArrayFilterChange('status', status, false)}
                  />
                </Badge>
              ))}
              {filters.priority.map(priority => (
                <Badge key={priority} variant="secondary" className="flex items-center gap-1">
                  Priority: {priorityOptions.find(p => p.value === priority)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleArrayFilterChange('priority', priority, false)}
                  />
                </Badge>
              ))}
              {filters.site.map(siteId => {
                const site = mockSites.find(s => s.id === siteId);
                return (
                  <Badge key={siteId} variant="secondary" className="flex items-center gap-1">
                    Site: {site?.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleArrayFilterChange('site', siteId, false)}
                    />
                  </Badge>
                );
              })}
              {filters.assignee.map(assigneeId => {
                if (assigneeId === 'unassigned') {
                  return (
                    <Badge key="unassigned" variant="secondary" className="flex items-center gap-1">
                      Assignee: Unassigned
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleArrayFilterChange('assignee', 'unassigned', false)}
                      />
                    </Badge>
                  );
                }
                const user = mockUsers.find(u => u.id === assigneeId);
                return (
                  <Badge key={assigneeId} variant="secondary" className="flex items-center gap-1">
                    Assignee: {user?.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleArrayFilterChange('assignee', assigneeId, false)}
                    />
                  </Badge>
                );
              })}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  Tag: {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleArrayFilterChange('tags', tag, false)}
                  />
                </Badge>
              ))}
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('dateRange', 'all')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
