// Work Order Management System Types
export type WorkOrderStatus = 'new' | 'open' | 'closed';
export type MessageSender = 'customer' | 'staff' | 'system';
export type MessageVisibility = 'public' | 'internal';
export type EventType = 'created' | 'assigned' | 'status_changed' | 'message_added' | 'reopened' | 'closed' | 'attachment_added';

export interface Site {
  id: string;
  name: string;
  address: string;
  branch_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  site_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  branch_id: string;
  role: 'manager' | 'staff' | 'coverage';
  created_at: Date;
  updated_at: Date;
}

export interface WorkOrder {
  id: string;
  status: WorkOrderStatus;
  site_id: string;
  customer_id: string;
  contact_id: string;
  owner_user_id?: string;
  tags: string[];
  external_ref?: string;
  subject: string;
  body: string;
  estimated_hours?: number;
  last_activity: Date;
  reopen_count: number;
  created_at: Date;
  updated_at: Date;
  
  // Relationships
  site?: Site;
  contact?: Contact;
  owner?: User;
  messages?: WorkOrderMessage[];
  events?: WorkOrderEvent[];
  watchers?: WorkOrderWatcher[];
}

export interface WorkOrderMessage {
  id: string;
  work_order_id: string;
  sender: MessageSender;
  visibility: MessageVisibility;
  body: string;
  attachments: string[];
  created_at: Date;
  
  // Relationships
  work_order?: WorkOrder;
}

export interface WorkOrderEvent {
  id: string;
  work_order_id: string;
  event_type: EventType;
  actor: string;
  at: Date;
  meta: Record<string, unknown>;
  
  // Relationships
  work_order?: WorkOrder;
}

export interface WorkOrderWatcher {
  id: string;
  work_order_id: string;
  user_id: string;
  created_at: Date;
  
  // Relationships
  work_order?: WorkOrder;
  user?: User;
}

export interface SiteManagerAssignment {
  id: string;
  site_id: string;
  user_id: string;
  created_at: Date;
  
  // Relationships
  site?: Site;
  user?: User;
}

// UI State Types
export interface WorkOrderFilters {
  status?: WorkOrderStatus[];
  priority?: string[];
  assignee?: string[];
  site?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface WorkOrderListView {
  workOrders: WorkOrder[];
  filters: WorkOrderFilters;
  sortBy: 'created_at' | 'last_activity' | 'priority';
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error?: string;
}

// Notification Types
export type NotificationType = 'work_order.created' | 'work_order.assigned' | 'work_order.reopened';

export interface Notification {
  id: string;
  type: NotificationType;
  user_id: string;
  work_order_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  
  // Relationships
  work_order?: WorkOrder;
}

// Offline Queue Types
export interface OfflineAction {
  id: string;
  type: 'message' | 'status_change' | 'assignment' | 'attachment';
  work_order_id: string;
  payload: unknown;
  timestamp: Date;
  synced: boolean;
}
