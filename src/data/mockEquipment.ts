// Mock Equipment Data for Demo

import { 
  Equipment, 
  MaintenanceSchedule, 
  UtilizationMetrics, 
  EquipmentAlert, 
  EquipmentPerformance,
  EquipmentLocation 
} from '@/types/equipment';

// Mock Equipment Data
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Commercial Mower Alpha',
    type: 'mower',
    model: 'ZTR-3000',
    manufacturer: 'GreenMaster',
    serialNumber: 'GM2024001',
    purchaseDate: '2024-01-15',
    purchasePrice: 12500,
    currentValue: 10800,
    status: 'active',
    assignedCrewId: 'crew-001',
    assignedCrewName: 'Alpha Team',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Sunset Plaza, West Hollywood, CA'
    },
    specifications: {
      engineHours: 245,
      maxEngineHours: 2000,
      fuelType: 'Gasoline',
      fuelCapacity: 8.5,
      weight: 850,
      dimensions: {
        length: 72,
        width: 60,
        height: 48
      }
    },
    lastMaintenanceDate: '2024-08-15',
    nextMaintenanceDate: '2024-09-15',
    warrantyExpirationDate: '2027-01-15',
    notes: 'High-performance zero-turn mower for large commercial properties'
  },
  {
    id: 'eq-002',
    name: 'Trimmer Pro Beta',
    type: 'trimmer',
    model: 'ST-450',
    manufacturer: 'EdgeCraft',
    serialNumber: 'EC2024045',
    purchaseDate: '2024-03-10',
    purchasePrice: 450,
    currentValue: 380,
    status: 'active',
    assignedCrewId: 'crew-001',
    assignedCrewName: 'Alpha Team',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Sunset Plaza, West Hollywood, CA'
    },
    specifications: {
      engineHours: 89,
      maxEngineHours: 500,
      fuelType: 'Mixed Gas',
      weight: 12,
      dimensions: {
        length: 72,
        width: 12,
        height: 12
      }
    },
    lastMaintenanceDate: '2024-08-01',
    nextMaintenanceDate: '2024-09-01',
    warrantyExpirationDate: '2026-03-10',
    notes: 'Professional string trimmer for precision edging'
  },
  {
    id: 'eq-003',
    name: 'Landscape Truck Gamma',
    type: 'truck',
    model: 'F-350 Super Duty',
    manufacturer: 'Ford',
    serialNumber: 'FD2024789',
    purchaseDate: '2024-02-01',
    purchasePrice: 45000,
    currentValue: 42000,
    status: 'maintenance',
    assignedCrewId: 'crew-002',
    assignedCrewName: 'Beta Team',
    location: {
      lat: 34.0928,
      lng: -118.3287,
      address: 'Service Center, Beverly Hills, CA'
    },
    specifications: {
      engineHours: 1250,
      maxEngineHours: 8000,
      fuelType: 'Diesel',
      fuelCapacity: 40,
      weight: 7500,
      dimensions: {
        length: 250,
        width: 80,
        height: 78
      }
    },
    lastMaintenanceDate: '2024-08-25',
    nextMaintenanceDate: '2024-11-25',
    warrantyExpirationDate: '2027-02-01',
    notes: 'Primary transportation and equipment hauling vehicle'
  },
  {
    id: 'eq-004',
    name: 'Backpack Blower Delta',
    type: 'blower',
    model: 'BP-600',
    manufacturer: 'AirForce',
    serialNumber: 'AF2024156',
    purchaseDate: '2024-04-20',
    purchasePrice: 320,
    currentValue: 280,
    status: 'active',
    assignedCrewId: 'crew-003',
    assignedCrewName: 'Gamma Team',
    location: {
      lat: 34.1478,
      lng: -118.1445,
      address: 'Griffith Park, Los Angeles, CA'
    },
    specifications: {
      engineHours: 67,
      maxEngineHours: 400,
      fuelType: 'Mixed Gas',
      weight: 22,
      dimensions: {
        length: 16,
        width: 14,
        height: 20
      }
    },
    lastMaintenanceDate: '2024-07-20',
    nextMaintenanceDate: '2024-10-20',
    warrantyExpirationDate: '2026-04-20',
    notes: 'High-velocity backpack blower for debris cleanup'
  },
  {
    id: 'eq-005',
    name: 'Chainsaw Epsilon',
    type: 'chainsaw',
    model: 'CS-70',
    manufacturer: 'TreeMaster',
    serialNumber: 'TM2024089',
    purchaseDate: '2024-05-15',
    purchasePrice: 650,
    currentValue: 580,
    status: 'repair',
    assignedCrewId: 'crew-003',
    assignedCrewName: 'Gamma Team',
    location: {
      lat: 34.0928,
      lng: -118.3287,
      address: 'Repair Shop, Beverly Hills, CA'
    },
    specifications: {
      engineHours: 45,
      maxEngineHours: 300,
      fuelType: 'Mixed Gas',
      weight: 15,
      dimensions: {
        length: 36,
        width: 10,
        height: 10
      }
    },
    lastMaintenanceDate: '2024-08-10',
    nextMaintenanceDate: '2024-09-10',
    warrantyExpirationDate: '2026-05-15',
    notes: 'Professional chainsaw for tree trimming and removal'
  },
  {
    id: 'eq-006',
    name: 'Equipment Trailer Zeta',
    type: 'trailer',
    model: 'ET-16',
    manufacturer: 'HaulMaster',
    serialNumber: 'HM2024234',
    purchaseDate: '2024-01-30',
    purchasePrice: 8500,
    currentValue: 7800,
    status: 'active',
    assignedCrewId: 'crew-002',
    assignedCrewName: 'Beta Team',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Medical Center, Downtown LA, CA'
    },
    specifications: {
      weight: 2200,
      dimensions: {
        length: 192,
        width: 96,
        height: 24
      }
    },
    lastMaintenanceDate: '2024-07-30',
    nextMaintenanceDate: '2024-10-30',
    warrantyExpirationDate: '2026-01-30',
    notes: 'Heavy-duty equipment trailer for transporting mowers and tools'
  }
];

// Mock Maintenance Schedules
export const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'maint-001',
    equipmentId: 'eq-001',
    equipmentName: 'Commercial Mower Alpha',
    type: 'routine',
    priority: 'medium',
    title: 'Monthly Service Check',
    description: 'Oil change, air filter replacement, blade sharpening',
    scheduledDate: '2024-09-15',
    estimatedDuration: 120,
    estimatedCost: 85,
    assignedTechnicianName: 'Mike Rodriguez',
    status: 'scheduled',
    partsRequired: [
      {
        id: 'part-001',
        name: 'Engine Oil (SAE 30)',
        partNumber: 'EO-SAE30-1QT',
        quantity: 2,
        unitCost: 8.50,
        supplier: 'Parts Plus',
        inStock: true
      },
      {
        id: 'part-002',
        name: 'Air Filter',
        partNumber: 'AF-ZTR3000',
        quantity: 1,
        unitCost: 15.00,
        supplier: 'GreenMaster Parts',
        inStock: true
      }
    ]
  },
  {
    id: 'maint-002',
    equipmentId: 'eq-003',
    equipmentName: 'Landscape Truck Gamma',
    type: 'repair',
    priority: 'high',
    title: 'Transmission Service',
    description: 'Transmission fluid leak repair and system flush',
    scheduledDate: '2024-08-28',
    estimatedDuration: 480,
    estimatedCost: 650,
    assignedTechnicianName: 'Carlos Martinez',
    status: 'in-progress',
    partsRequired: [
      {
        id: 'part-003',
        name: 'Transmission Seal Kit',
        partNumber: 'TSK-F350-2024',
        quantity: 1,
        unitCost: 85.00,
        supplier: 'Ford Parts Direct',
        inStock: false
      }
    ]
  },
  {
    id: 'maint-003',
    equipmentId: 'eq-005',
    equipmentName: 'Chainsaw Epsilon',
    type: 'repair',
    priority: 'critical',
    title: 'Chain Brake Repair',
    description: 'Chain brake mechanism not engaging properly - safety issue',
    scheduledDate: '2024-08-26',
    estimatedDuration: 90,
    estimatedCost: 125,
    assignedTechnicianName: 'Sarah Johnson',
    status: 'overdue',
    partsRequired: [
      {
        id: 'part-004',
        name: 'Chain Brake Assembly',
        partNumber: 'CBA-CS70',
        quantity: 1,
        unitCost: 45.00,
        supplier: 'TreeMaster Parts',
        inStock: true
      }
    ]
  }
];

// Mock Utilization Metrics
export const mockUtilizationMetrics: UtilizationMetrics[] = [
  {
    equipmentId: 'eq-001',
    equipmentName: 'Commercial Mower Alpha',
    period: {
      startDate: '2024-08-01',
      endDate: '2024-08-31'
    },
    totalHours: 168,
    activeHours: 142,
    idleHours: 20,
    maintenanceHours: 6,
    utilizationRate: 84.5,
    efficiency: 92.3,
    costPerHour: 15.50,
    revenueGenerated: 2840,
    profitMargin: 68.2,
    fuelConsumption: 45.2,
    fuelCost: 158.20,
    jobsCompleted: 28,
    averageJobDuration: 5.1,
    breakdownIncidents: 0,
    maintenanceCosts: 85.00
  },
  {
    equipmentId: 'eq-003',
    equipmentName: 'Landscape Truck Gamma',
    period: {
      startDate: '2024-08-01',
      endDate: '2024-08-31'
    },
    totalHours: 176,
    activeHours: 134,
    idleHours: 30,
    maintenanceHours: 12,
    utilizationRate: 76.1,
    efficiency: 88.1,
    costPerHour: 25.75,
    revenueGenerated: 4200,
    profitMargin: 58.4,
    fuelConsumption: 125.8,
    fuelCost: 440.30,
    jobsCompleted: 35,
    averageJobDuration: 3.8,
    breakdownIncidents: 1,
    maintenanceCosts: 650.00
  }
];

// Mock Equipment Alerts
export const mockEquipmentAlerts: EquipmentAlert[] = [
  {
    id: 'alert-001',
    equipmentId: 'eq-001',
    equipmentName: 'Commercial Mower Alpha',
    type: 'maintenance_due',
    severity: 'warning',
    title: 'Scheduled Maintenance Due',
    message: 'Monthly service check scheduled for September 15th',
    createdAt: '2024-08-28T08:00:00Z',
    actionRequired: true,
    actionUrl: '/equipment/eq-001/maintenance'
  },
  {
    id: 'alert-002',
    equipmentId: 'eq-005',
    equipmentName: 'Chainsaw Epsilon',
    type: 'repair_needed',
    severity: 'critical',
    title: 'Safety Issue - Immediate Attention Required',
    message: 'Chain brake repair is overdue. Equipment should not be used until repaired.',
    createdAt: '2024-08-26T10:30:00Z',
    actionRequired: true,
    actionUrl: '/equipment/eq-005/repair'
  },
  {
    id: 'alert-003',
    equipmentId: 'eq-003',
    equipmentName: 'Landscape Truck Gamma',
    type: 'high_usage',
    severity: 'info',
    title: 'High Usage Alert',
    message: 'Equipment usage is 15% above average for this period',
    createdAt: '2024-08-27T14:15:00Z',
    actionRequired: false
  }
];

// Mock Equipment Performance
export const mockEquipmentPerformance: EquipmentPerformance[] = [
  {
    equipmentId: 'eq-001',
    equipmentName: 'Commercial Mower Alpha',
    performanceScore: 92,
    reliabilityScore: 95,
    efficiencyScore: 89,
    costEffectivenessScore: 87,
    trends: [
      { period: '2024-05', performanceScore: 88, utilizationRate: 82, maintenanceCosts: 65, breakdownCount: 0 },
      { period: '2024-06', performanceScore: 90, utilizationRate: 85, maintenanceCosts: 75, breakdownCount: 0 },
      { period: '2024-07', performanceScore: 91, utilizationRate: 83, maintenanceCosts: 80, breakdownCount: 0 },
      { period: '2024-08', performanceScore: 92, utilizationRate: 84, maintenanceCosts: 85, breakdownCount: 0 }
    ],
    recommendations: [
      'Continue current maintenance schedule',
      'Consider blade upgrade for improved efficiency',
      'Monitor fuel consumption trends'
    ]
  }
];

// Mock Equipment Locations
export const mockEquipmentLocations: EquipmentLocation[] = [
  {
    equipmentId: 'eq-001',
    equipmentName: 'Commercial Mower Alpha',
    currentLocation: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Sunset Plaza, West Hollywood, CA',
      timestamp: '2024-08-28T10:30:00Z'
    },
    locationHistory: [
      {
        lat: 34.0928,
        lng: -118.3287,
        address: 'Equipment Yard, Beverly Hills, CA',
        timestamp: '2024-08-28T07:00:00Z',
        duration: 30
      },
      {
        lat: 34.0522,
        lng: -118.2437,
        address: 'Sunset Plaza, West Hollywood, CA',
        timestamp: '2024-08-28T08:00:00Z',
        duration: 150
      }
    ],
    geofenceAlerts: []
  }
];

// Helper functions for equipment data
export function getEquipmentById(id: string): Equipment | undefined {
  return mockEquipment.find(eq => eq.id === id);
}

export function getEquipmentByType(type: string): Equipment[] {
  return mockEquipment.filter(eq => eq.type === type);
}

export function getEquipmentByStatus(status: string): Equipment[] {
  return mockEquipment.filter(eq => eq.status === status);
}

export function getMaintenanceByEquipmentId(equipmentId: string): MaintenanceSchedule[] {
  return mockMaintenanceSchedules.filter(m => m.equipmentId === equipmentId);
}

export function getOverdueMaintenanceItems(): MaintenanceSchedule[] {
  return mockMaintenanceSchedules.filter(m => m.status === 'overdue');
}

export function getUpcomingMaintenanceItems(days: number = 7): MaintenanceSchedule[] {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return mockMaintenanceSchedules.filter(m => {
    const scheduledDate = new Date(m.scheduledDate);
    return scheduledDate <= futureDate && m.status === 'scheduled';
  });
}

export function getEquipmentAlerts(equipmentId?: string): EquipmentAlert[] {
  if (equipmentId) {
    return mockEquipmentAlerts.filter(alert => alert.equipmentId === equipmentId);
  }
  return mockEquipmentAlerts;
}

export function getCriticalAlerts(): EquipmentAlert[] {
  return mockEquipmentAlerts.filter(alert => alert.severity === 'critical');
}

// Equipment statistics
export function getEquipmentStats() {
  const total = mockEquipment.length;
  const active = mockEquipment.filter(eq => eq.status === 'active').length;
  const maintenance = mockEquipment.filter(eq => eq.status === 'maintenance').length;
  const repair = mockEquipment.filter(eq => eq.status === 'repair').length;
  const idle = mockEquipment.filter(eq => eq.status === 'idle').length;
  
  const totalValue = mockEquipment.reduce((sum, eq) => sum + eq.currentValue, 0);
  const averageUtilization = mockUtilizationMetrics.reduce((sum, util) => sum + util.utilizationRate, 0) / mockUtilizationMetrics.length;
  
  return {
    total,
    active,
    maintenance,
    repair,
    idle,
    totalValue,
    averageUtilization: Math.round(averageUtilization * 10) / 10,
    criticalAlerts: getCriticalAlerts().length,
    overdueMaintenanceItems: getOverdueMaintenanceItems().length
  };
}
