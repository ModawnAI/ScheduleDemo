// Equipment Management Components
export { default as EquipmentManagement } from './EquipmentManagement';
export { default as EquipmentDashboard } from './EquipmentDashboard';

// Re-export types for convenience
export type {
  Equipment,
  MaintenanceSchedule,
  UtilizationMetrics,
  EquipmentAlert,
  EquipmentPerformance,
  EquipmentLocation,
  EquipmentType,
  EquipmentStatus,
  MaintenanceType,
  MaintenancePriority,
  EquipmentFilter,
  EquipmentSortOption
} from '@/types/equipment';

// Re-export configuration constants
export {
  EQUIPMENT_TYPE_CONFIG,
  EQUIPMENT_STATUS_CONFIG,
  MAINTENANCE_PRIORITY_CONFIG
} from '@/types/equipment';

// Re-export mock data and utilities
export {
  mockEquipment,
  mockMaintenanceSchedules,
  mockUtilizationMetrics,
  mockEquipmentAlerts,
  mockEquipmentPerformance,
  mockEquipmentLocations,
  getEquipmentById,
  getEquipmentByType,
  getEquipmentByStatus,
  getMaintenanceByEquipmentId,
  getOverdueMaintenanceItems,
  getUpcomingMaintenanceItems,
  getEquipmentAlerts,
  getCriticalAlerts,
  getEquipmentStats
} from '@/data/mockEquipment';
