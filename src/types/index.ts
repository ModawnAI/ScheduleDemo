// Core Data Types for Schedule Demo Application

export type ServiceType = 
  | "Weekly Mowing" 
  | "Bi-weekly Mowing" 
  | "Monthly Cleanup" 
  | "Fertilization" 
  | "Hedge Trimming" 
  | "Leaf Removal" 
  | "Irrigation Check" 
  | "Mulch Installation";

export interface Service {
  serviceType: ServiceType;
  frequency: number; // times per month
  month: string; // e.g., "September", "October"
}

export interface Contract {
  id: string;
  clientName: string;
  services: Service[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: string; // e.g., "Lead", "Assistant", "Equipment Operator"
}

export interface Crew {
  id: string;
  name: string;
  specialization: string; // e.g., "Mowing", "Landscaping", "Tree Service"
  members: CrewMember[];
}

export interface JobTicket {
  id: string;
  clientId: string;
  address: string;
  lat: number;
  long: number;
  task: string;
  estimatedHours: number;
  requiredEquipment: string[];
  requiredMaterials: string[];
  serviceType?: string; // Optional: links back to contract service
  priority?: "high" | "medium" | "low";
  status?: "pending" | "in-progress" | "completed" | "cancelled";
}

export interface RouteMetrics {
  driveTime: number; // in minutes
  billableHours: number; // in hours
  totalDistance?: number; // in miles
  fuelCost?: number; // estimated fuel cost
}

export interface CrewSchedule {
  crewId: string;
  route: string[]; // array of jobTicketIds in order
  metrics: RouteMetrics;
  startTime?: string; // e.g., "08:00"
  endTime?: string; // e.g., "17:00"
}

export interface DailySchedule {
  date: string; // ISO date string e.g., "2024-09-16"
  crewSchedules: CrewSchedule[];
}

// Weather-related types
export interface WeatherAlert {
  type: "rain" | "snow" | "wind" | "heat";
  severity: "low" | "medium" | "high";
  startTime: string; // e.g., "14:00"
  endTime: string; // e.g., "18:00"
  description: string;
}

export interface WeatherForecast {
  date: string;
  alerts: WeatherAlert[];
  temperature: {
    high: number;
    low: number;
  };
  conditions: string; // e.g., "Partly Cloudy", "Rain"
}

// UI State types
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "service" | "maintenance" | "emergency";
  clientName: string;
  serviceType: string;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface RoutePoint extends MapCoordinates {
  jobTicketId: string;
  address: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
}

// Application state types
export interface AppState {
  selectedDate: string | null;
  selectedCrew: string | null;
  viewMode: "yearly" | "monthly" | "daily";
  currentMonth: string;
  currentYear: number;
}

// Utility types
export type ServiceFrequency = "weekly" | "bi-weekly" | "monthly" | "quarterly" | "seasonal";
export type CrewSpecialization = "mowing" | "landscaping" | "tree-service" | "irrigation" | "hardscape";
export type JobStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "weather-delayed";
export type WeatherCondition = "sunny" | "cloudy" | "rain" | "snow" | "wind" | "storm";

// Form types for future use
export interface CreateJobTicketForm {
  clientId: string;
  address: string;
  task: string;
  estimatedHours: number;
  requiredEquipment: string[];
  requiredMaterials: string[];
  priority: "high" | "medium" | "low";
  scheduledDate: string;
}

export interface UpdateScheduleForm {
  crewId: string;
  jobTicketIds: string[];
  startTime: string;
  notes?: string;
}
