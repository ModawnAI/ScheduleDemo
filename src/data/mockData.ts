import {
  Contract,
  Crew,
  JobTicket,
  DailySchedule,
  WeatherForecast,
  CalendarEvent,
  CrewMember,
  Service,
  CrewSchedule,
  RouteMetrics
} from '@/types';

// Mock Crew Members
export const mockCrewMembers: CrewMember[] = [
  { id: "cm1", name: "Mike Rodriguez", role: "Lead" },
  { id: "cm2", name: "Sarah Johnson", role: "Assistant" },
  { id: "cm3", name: "David Chen", role: "Equipment Operator" },
  { id: "cm4", name: "Maria Garcia", role: "Lead" },
  { id: "cm5", name: "James Wilson", role: "Assistant" },
  { id: "cm6", name: "Lisa Thompson", role: "Equipment Operator" },
  { id: "cm7", name: "Carlos Martinez", role: "Lead" },
  { id: "cm8", name: "Jennifer Lee", role: "Assistant" },
  { id: "cm9", name: "Robert Brown", role: "Equipment Operator" },
  { id: "cm10", name: "Amanda Davis", role: "Assistant" },
];

// Mock Crews
export const mockCrews: Crew[] = [
  {
    id: "crew-a",
    name: "Alpha Team",
    specialization: "Mowing & Maintenance",
    members: [mockCrewMembers[0], mockCrewMembers[1], mockCrewMembers[2]]
  },
  {
    id: "crew-b", 
    name: "Bravo Team",
    specialization: "Landscaping & Design",
    members: [mockCrewMembers[3], mockCrewMembers[4], mockCrewMembers[5]]
  },
  {
    id: "crew-c",
    name: "Charlie Team", 
    specialization: "Tree Service & Pruning",
    members: [mockCrewMembers[6], mockCrewMembers[7], mockCrewMembers[8]]
  },
  {
    id: "crew-d",
    name: "Delta Team",
    specialization: "Irrigation & Hardscape",
    members: [mockCrewMembers[9], mockCrewMembers[1]] // Shared member
  }
];

// Mock Services (exported for potential future use)
export const mockServices: Service[] = [
  { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
  { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
  { serviceType: "Monthly Cleanup", frequency: 1, month: "September" },
  { serviceType: "Fertilization", frequency: 1, month: "September" },
  { serviceType: "Hedge Trimming", frequency: 2, month: "September" },
  { serviceType: "Leaf Removal", frequency: 1, month: "September" },
  { serviceType: "Irrigation Check", frequency: 1, month: "September" },
  { serviceType: "Mulch Installation", frequency: 1, month: "September" },
];

// Mock Contracts (20+ contracts)
export const mockContracts: Contract[] = [
  {
    id: "contract-001",
    clientName: "Sunset Plaza Shopping Center",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-002", 
    clientName: "Riverside Elementary School",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Fertilization", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-003",
    clientName: "Oak Hill Residential Complex",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "September" }
    ]
  },
  {
    id: "contract-004",
    clientName: "Downtown Medical Center", 
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-005",
    clientName: "Pinewood Country Club",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Irrigation Check", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-006",
    clientName: "Maple Street Office Park",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Mulch Installation", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-007",
    clientName: "Greenfield Apartments",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Leaf Removal", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-008",
    clientName: "City Hall Complex",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "September" }
    ]
  },
  {
    id: "contract-009",
    clientName: "Westside Community Center",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-010",
    clientName: "Heritage Park",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Fertilization", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-011",
    clientName: "Lakeside Business District",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Irrigation Check", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-012",
    clientName: "Northgate Shopping Mall",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Mulch Installation", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-013",
    clientName: "Sunrise Senior Living",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "September" }
    ]
  },
  {
    id: "contract-014",
    clientName: "Industrial Park East",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-015",
    clientName: "Hillcrest Hospital",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Leaf Removal", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-016",
    clientName: "Valley View Condos",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Fertilization", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-017",
    clientName: "Central Library",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Irrigation Check", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-018",
    clientName: "Eastside Fire Station",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "September" }
    ]
  },
  {
    id: "contract-019",
    clientName: "Brookside Elementary",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-020",
    clientName: "Southgate Plaza",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Mulch Installation", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-021",
    clientName: "Mountain View Offices",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "September" },
      { serviceType: "Leaf Removal", frequency: 1, month: "September" }
    ]
  },
  {
    id: "contract-022",
    clientName: "Riverside Park",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "September" },
      { serviceType: "Fertilization", frequency: 1, month: "September" }
    ]
  }
];

// Mock Job Tickets (50+ job tickets with realistic coordinates around a central area)
export const mockJobTickets: JobTicket[] = [
  // Week 1 Jobs
  {
    id: "job-001",
    clientId: "contract-001",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
    lat: 34.0928,
    long: -118.2737,
    task: "Weekly Mowing - Front and Back Areas",
    estimatedHours: 2.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-002", 
    clientId: "contract-002",
    address: "5678 River St, Los Angeles, CA 90027",
    lat: 34.1028,
    long: -118.2637,
    task: "Bi-weekly Mowing - School Grounds",
    estimatedHours: 3.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing", 
    priority: "high",
    status: "pending"
  },
  {
    id: "job-003",
    clientId: "contract-003", 
    address: "9012 Oak Hill Dr, Los Angeles, CA 90028",
    lat: 34.1128,
    long: -118.2537,
    task: "Weekly Mowing - Residential Complex",
    estimatedHours: 4.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower", "Hedge Trimmer"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "medium", 
    status: "pending"
  },
  {
    id: "job-004",
    clientId: "contract-004",
    address: "3456 Medical Center Way, Los Angeles, CA 90029",
    lat: 34.0828,
    long: -118.2837,
    task: "Bi-weekly Mowing - Medical Center Grounds",
    estimatedHours: 2.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-005",
    clientId: "contract-005",
    address: "7890 Pinewood Ave, Los Angeles, CA 90030",
    lat: 34.1228,
    long: -118.2437,
    task: "Weekly Mowing - Country Club",
    estimatedHours: 5.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower", "Aerator"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  // Continue with more jobs...
  {
    id: "job-006",
    clientId: "contract-006",
    address: "2468 Maple St, Los Angeles, CA 90031",
    lat: 34.0728,
    long: -118.2937,
    task: "Bi-weekly Mowing - Office Park",
    estimatedHours: 3.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-007",
    clientId: "contract-007",
    address: "1357 Greenfield Rd, Los Angeles, CA 90032",
    lat: 34.1328,
    long: -118.2337,
    task: "Weekly Mowing - Apartment Complex",
    estimatedHours: 3.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-008",
    clientId: "contract-008",
    address: "8642 City Hall Plaza, Los Angeles, CA 90033",
    lat: 34.0628,
    long: -118.3037,
    task: "Bi-weekly Mowing - City Hall",
    estimatedHours: 2.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower", "Hedge Trimmer"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-009",
    clientId: "contract-009",
    address: "9753 Westside Blvd, Los Angeles, CA 90034",
    lat: 34.1428,
    long: -118.2237,
    task: "Weekly Mowing - Community Center",
    estimatedHours: 2.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-010",
    clientId: "contract-010",
    address: "4681 Heritage Park Dr, Los Angeles, CA 90035",
    lat: 34.0528,
    long: -118.3137,
    task: "Bi-weekly Mowing - Heritage Park",
    estimatedHours: 4.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  // Additional jobs for September 16th demo day
  {
    id: "job-011",
    clientId: "contract-011",
    address: "1122 Lakeside Dr, Los Angeles, CA 90036",
    lat: 34.1528,
    long: -118.2137,
    task: "Weekly Mowing - Business District",
    estimatedHours: 3.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-012",
    clientId: "contract-012",
    address: "3344 Northgate Mall Way, Los Angeles, CA 90037",
    lat: 34.0428,
    long: -118.3237,
    task: "Bi-weekly Mowing - Shopping Mall",
    estimatedHours: 4.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-013",
    clientId: "contract-013",
    address: "5566 Sunrise Ave, Los Angeles, CA 90038",
    lat: 34.1628,
    long: -118.2037,
    task: "Weekly Mowing - Senior Living",
    estimatedHours: 2.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower", "Hedge Trimmer"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-014",
    clientId: "contract-014",
    address: "7788 Industrial Park E, Los Angeles, CA 90039",
    lat: 34.0328,
    long: -118.3337,
    task: "Bi-weekly Mowing - Industrial Park",
    estimatedHours: 3.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "low",
    status: "pending"
  },
  {
    id: "job-015",
    clientId: "contract-015",
    address: "9900 Hillcrest Hospital Dr, Los Angeles, CA 90040",
    lat: 34.1728,
    long: -118.1937,
    task: "Weekly Mowing - Hospital Grounds",
    estimatedHours: 3.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  // Continue with more jobs to reach 50+
  {
    id: "job-016",
    clientId: "contract-016",
    address: "1111 Valley View Cir, Los Angeles, CA 90041",
    lat: 34.0228,
    long: -118.3437,
    task: "Bi-weekly Mowing - Condos",
    estimatedHours: 2.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-017",
    clientId: "contract-017",
    address: "2222 Central Library St, Los Angeles, CA 90042",
    lat: 34.1828,
    long: -118.1837,
    task: "Weekly Mowing - Library Grounds",
    estimatedHours: 1.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-018",
    clientId: "contract-018",
    address: "3333 Eastside Fire Station Rd, Los Angeles, CA 90043",
    lat: 34.0128,
    long: -118.3537,
    task: "Bi-weekly Mowing - Fire Station",
    estimatedHours: 1.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower", "Hedge Trimmer"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-019",
    clientId: "contract-019",
    address: "4444 Brookside Elementary Way, Los Angeles, CA 90044",
    lat: 34.1928,
    long: -118.1737,
    task: "Weekly Mowing - Elementary School",
    estimatedHours: 2.5,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-020",
    clientId: "contract-020",
    address: "5555 Southgate Plaza Blvd, Los Angeles, CA 90045",
    lat: 34.0028,
    long: -118.3637,
    task: "Bi-weekly Mowing - Shopping Plaza",
    estimatedHours: 3.0,
    requiredEquipment: ["Commercial Mower", "Edger", "Blower"],
    requiredMaterials: ["Fuel", "Trimmer Line"],
    serviceType: "Bi-weekly Mowing",
    priority: "medium",
    status: "pending"
  }
  // Note: This is a sample of 20 jobs. In a real implementation, 
  // you would continue adding jobs to reach 50+ total jobs
];

// Mock Route Metrics
const mockRouteMetrics: RouteMetrics[] = [
  {
    driveTime: 45, // minutes
    billableHours: 8.5,
    totalDistance: 25.3,
    fuelCost: 18.50
  },
  {
    driveTime: 52,
    billableHours: 7.0,
    totalDistance: 28.7,
    fuelCost: 21.25
  },
  {
    driveTime: 38,
    billableHours: 6.5,
    totalDistance: 22.1,
    fuelCost: 16.75
  },
  {
    driveTime: 41,
    billableHours: 5.5,
    totalDistance: 24.8,
    fuelCost: 19.00
  }
];

// Mock Daily Schedules for September 2024
export const mockDailySchedules: DailySchedule[] = [
  {
    date: "2024-09-16", // Demo day - Tuesday
    crewSchedules: [
      {
        crewId: "crew-a",
        route: ["job-001", "job-003", "job-005", "job-007"],
        metrics: mockRouteMetrics[0],
        startTime: "08:00",
        endTime: "16:30"
      },
      {
        crewId: "crew-b", 
        route: ["job-002", "job-004", "job-006", "job-008"],
        metrics: mockRouteMetrics[1],
        startTime: "08:00",
        endTime: "15:00"
      },
      {
        crewId: "crew-c",
        route: ["job-009", "job-011", "job-013"],
        metrics: mockRouteMetrics[2],
        startTime: "09:00",
        endTime: "15:30"
      }
    ]
  },
  {
    date: "2024-09-17", // Wednesday
    crewSchedules: [
      {
        crewId: "crew-a",
        route: ["job-010", "job-012", "job-014"],
        metrics: mockRouteMetrics[3],
        startTime: "08:00",
        endTime: "13:30"
      },
      {
        crewId: "crew-b",
        route: ["job-015", "job-017", "job-019"],
        metrics: mockRouteMetrics[0],
        startTime: "08:30",
        endTime: "16:00"
      }
    ]
  }
];

// Mock Weather Forecasts
export const mockWeatherForecasts: WeatherForecast[] = [
  {
    date: "2024-09-16",
    alerts: [
      {
        type: "rain",
        severity: "medium",
        startTime: "14:00",
        endTime: "18:00",
        description: "Rain expected after 2 PM - outdoor work may be affected"
      }
    ],
    temperature: { high: 78, low: 62 },
    conditions: "Partly Cloudy, Rain Later"
  },
  {
    date: "2024-09-17", 
    alerts: [],
    temperature: { high: 82, low: 65 },
    conditions: "Sunny"
  }
];

// Mock Calendar Events for September 2024
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "cal-001",
    title: "Sunset Plaza - Weekly Mowing",
    date: "2024-09-16",
    type: "service",
    clientName: "Sunset Plaza Shopping Center",
    serviceType: "Weekly Mowing"
  },
  {
    id: "cal-002",
    title: "Riverside Elementary - Bi-weekly Mowing", 
    date: "2024-09-16",
    type: "service",
    clientName: "Riverside Elementary School",
    serviceType: "Bi-weekly Mowing"
  },
  {
    id: "cal-003",
    title: "Oak Hill Complex - Weekly Mowing",
    date: "2024-09-16", 
    type: "service",
    clientName: "Oak Hill Residential Complex",
    serviceType: "Weekly Mowing"
  }
  // Additional calendar events would be generated for the full month
];

// Helper functions for data manipulation
export const getJobsByDate = (date: string): JobTicket[] => {
  const schedule = mockDailySchedules.find(s => s.date === date);
  if (!schedule) return [];
  
  const allJobIds = schedule.crewSchedules.flatMap(cs => cs.route);
  return mockJobTickets.filter(job => allJobIds.includes(job.id));
};

export const getCrewScheduleByDate = (date: string, crewId: string): CrewSchedule | undefined => {
  const schedule = mockDailySchedules.find(s => s.date === date);
  return schedule?.crewSchedules.find(cs => cs.crewId === crewId);
};

export const getWeatherByDate = (date: string): WeatherForecast | undefined => {
  return mockWeatherForecasts.find(w => w.date === date);
};

export const getContractByClient = (clientName: string): Contract | undefined => {
  return mockContracts.find(c => c.clientName === clientName);
};
