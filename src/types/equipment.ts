// Equipment Management TypeScript Interfaces

export type EquipmentType = 
  | 'mower' 
  | 'trimmer' 
  | 'blower' 
  | 'truck' 
  | 'trailer' 
  | 'edger' 
  | 'chainsaw' 
  | 'spreader' 
  | 'aerator' 
  | 'irrigation';

export type EquipmentStatus = 
  | 'active' 
  | 'maintenance' 
  | 'repair' 
  | 'idle' 
  | 'retired';

export type MaintenanceType = 
  | 'routine' 
  | 'preventive' 
  | 'repair' 
  | 'inspection' 
  | 'emergency';

export type MaintenancePriority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  status: EquipmentStatus;
  assignedCrewId?: string;
  assignedCrewName?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  specifications: {
    engineHours?: number;
    maxEngineHours?: number;
    fuelType?: string;
    fuelCapacity?: number;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  warrantyExpirationDate?: string;
  notes?: string;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  title: string;
  description: string;
  scheduledDate: string;
  estimatedDuration: number; // in minutes
  estimatedCost: number;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  completedDate?: string;
  actualDuration?: number;
  actualCost?: number;
  notes?: string;
  partsRequired?: MaintenancePart[];
  completionPhotos?: string[];
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  supplier?: string;
  inStock: boolean;
}

export interface UtilizationMetrics {
  equipmentId: string;
  equipmentName: string;
  period: {
    startDate: string;
    endDate: string;
  };
  totalHours: number;
  activeHours: number;
  idleHours: number;
  maintenanceHours: number;
  utilizationRate: number; // percentage
  efficiency: number; // percentage
  costPerHour: number;
  revenueGenerated: number;
  profitMargin: number;
  fuelConsumption?: number;
  fuelCost?: number;
  jobsCompleted: number;
  averageJobDuration: number;
  breakdownIncidents: number;
  maintenanceCosts: number;
}

export interface EquipmentAlert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'maintenance_due' | 'repair_needed' | 'low_fuel' | 'overdue_service' | 'warranty_expiring' | 'high_usage';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  createdAt: string;
  resolvedAt?: string;
  actionRequired: boolean;
  actionUrl?: string;
}

export interface EquipmentPerformance {
  equipmentId: string;
  equipmentName: string;
  performanceScore: number; // 0-100
  reliabilityScore: number; // 0-100
  efficiencyScore: number; // 0-100
  costEffectivenessScore: number; // 0-100;
  trends: {
    period: string;
    performanceScore: number;
    utilizationRate: number;
    maintenanceCosts: number;
    breakdownCount: number;
  }[];
  recommendations: string[];
}

export interface EquipmentLocation {
  equipmentId: string;
  equipmentName: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  locationHistory: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
    duration: number; // minutes spent at location
  }[];
  geofenceAlerts: {
    id: string;
    type: 'entered' | 'exited' | 'unauthorized_movement';
    location: string;
    timestamp: string;
    resolved: boolean;
  }[];
}

export interface EquipmentFilter {
  type?: EquipmentType[];
  status?: EquipmentStatus[];
  assignedCrew?: string[];
  maintenanceDue?: boolean;
  location?: string;
  searchQuery?: string;
}

export interface EquipmentSortOption {
  field: 'name' | 'type' | 'status' | 'utilizationRate' | 'lastMaintenance' | 'nextMaintenance' | 'purchaseDate';
  direction: 'asc' | 'desc';
}

// Equipment configuration constants
export const EQUIPMENT_TYPE_CONFIG = {
  mower: {
    icon: 'Scissors',
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    borderColor: 'border-chart-1/20',
    category: 'Cutting Equipment'
  },
  trimmer: {
    icon: 'Zap',
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/20',
    category: 'Cutting Equipment'
  },
  blower: {
    icon: 'Wind',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    borderColor: 'border-chart-3/20',
    category: 'Cleanup Equipment'
  },
  truck: {
    icon: 'Truck',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/20',
    category: 'Transportation'
  },
  trailer: {
    icon: 'Container',
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    borderColor: 'border-chart-5/20',
    category: 'Transportation'
  },
  edger: {
    icon: 'Slice',
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    borderColor: 'border-chart-1/20',
    category: 'Cutting Equipment'
  },
  chainsaw: {
    icon: 'Axe',
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/20',
    category: 'Tree Care'
  },
  spreader: {
    icon: 'Sprout',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    borderColor: 'border-chart-3/20',
    category: 'Application Equipment'
  },
  aerator: {
    icon: 'Drill',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/20',
    category: 'Soil Equipment'
  },
  irrigation: {
    icon: 'Droplets',
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    borderColor: 'border-chart-5/20',
    category: 'Irrigation Systems'
  }
} as const;

export const EQUIPMENT_STATUS_CONFIG = {
  active: {
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    borderColor: 'border-chart-1/20',
    label: 'Active'
  },
  maintenance: {
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    borderColor: 'border-chart-3/20',
    label: 'Maintenance'
  },
  repair: {
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    borderColor: 'border-chart-5/20',
    label: 'Repair Needed'
  },
  idle: {
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/20',
    label: 'Idle'
  },
  retired: {
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    borderColor: 'border-muted/20',
    label: 'Retired'
  }
} as const;

export const MAINTENANCE_PRIORITY_CONFIG = {
  low: {
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/20',
    label: 'Low Priority'
  },
  medium: {
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    borderColor: 'border-chart-3/20',
    label: 'Medium Priority'
  },
  high: {
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/20',
    label: 'High Priority'
  },
  critical: {
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    borderColor: 'border-chart-5/20',
    label: 'Critical'
  }
} as const;
