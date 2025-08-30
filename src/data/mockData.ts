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

// Mock Crew Members with detailed landscaping expertise
export const mockCrewMembers: CrewMember[] = [
  { id: "cm1", name: "Miguel Rodriguez", role: "Crew Lead", certifications: ["Pesticide License", "ISA Arborist"], yearsExperience: 12 },
  { id: "cm2", name: "Sarah Chen", role: "Landscape Specialist", certifications: ["Irrigation Certified", "Horticulture Degree"], yearsExperience: 8 },
  { id: "cm3", name: "David Thompson", role: "Equipment Operator", certifications: ["CDL License", "Heavy Equipment"], yearsExperience: 15 },
  { id: "cm4", name: "Maria Santos", role: "Crew Lead", certifications: ["Landscape Design", "Plant Health Care"], yearsExperience: 10 },
  { id: "cm5", name: "James Wilson", role: "Maintenance Tech", certifications: ["Turf Management", "Fertilizer License"], yearsExperience: 6 },
  { id: "cm6", name: "Lisa Park", role: "Equipment Operator", certifications: ["Chainsaw Certified", "First Aid/CPR"], yearsExperience: 9 },
  { id: "cm7", name: "Carlos Martinez", role: "Tree Specialist", certifications: ["ISA Certified Arborist", "Tree Risk Assessment"], yearsExperience: 14 },
  { id: "cm8", name: "Jennifer Kim", role: "Irrigation Tech", certifications: ["Backflow Prevention", "Smart Controller Certified"], yearsExperience: 7 },
  { id: "cm9", name: "Robert Johnson", role: "Hardscape Lead", certifications: ["Concrete Certified", "Retaining Wall Specialist"], yearsExperience: 11 },
  { id: "cm10", name: "Amanda Davis", role: "Quality Inspector", certifications: ["Landscape Architecture", "Project Management"], yearsExperience: 13 },
  { id: "cm11", name: "Tony Ricci", role: "Pesticide Applicator", certifications: ["Commercial Pesticide License", "IPM Certified"], yearsExperience: 16 },
  { id: "cm12", name: "Rachel Green", role: "Plant Specialist", certifications: ["Master Gardener", "Native Plant Society"], yearsExperience: 5 },
];

// Mock Crews with specialized landscaping teams
export const mockCrews: Crew[] = [
  {
    id: "crew-a",
    name: "Green Maintenance Pro",
    specialization: "Weekly Lawn Care & Maintenance",
    members: [mockCrewMembers[0], mockCrewMembers[4], mockCrewMembers[2]],
    equipment: ["Zero-turn mowers", "Edgers", "Blowers", "Hedge trimmers"],
    serviceRadius: 15,
    avgJobsPerDay: 12,
    efficiency: 94
  },
  {
    id: "crew-b", 
    name: "Landscape Design Squad",
    specialization: "Installation & Hardscaping",
    members: [mockCrewMembers[3], mockCrewMembers[8], mockCrewMembers[1]],
    equipment: ["Mini excavator", "Compactors", "Concrete tools", "Plant materials"],
    serviceRadius: 25,
    avgJobsPerDay: 4,
    efficiency: 89
  },
  {
    id: "crew-c",
    name: "Arbor Care Specialists", 
    specialization: "Tree Service & Plant Health",
    members: [mockCrewMembers[6], mockCrewMembers[10], mockCrewMembers[5]],
    equipment: ["Bucket truck", "Chainsaws", "Stump grinder", "Spray equipment"],
    serviceRadius: 30,
    avgJobsPerDay: 6,
    efficiency: 91
  },
  {
    id: "crew-d",
    name: "Irrigation Solutions Team",
    specialization: "Smart Irrigation & Water Systems", 
    members: [mockCrewMembers[7], mockCrewMembers[11]],
    equipment: ["Trenching equipment", "PVC tools", "Smart controllers", "Flow meters"],
    serviceRadius: 20,
    avgJobsPerDay: 5,
    efficiency: 96
  },
  {
    id: "crew-e",
    name: "Seasonal Enhancement Crew",
    specialization: "Seasonal Color & Specialty Services",
    members: [mockCrewMembers[9], mockCrewMembers[11], mockCrewMembers[0]],
    equipment: ["Planting tools", "Mulch spreaders", "Holiday lighting", "Seasonal decor"],
    serviceRadius: 18,
    avgJobsPerDay: 8,
    efficiency: 87
  }
];

// Mock Services (exported for potential future use)
export const mockServices: Service[] = [
  { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
  { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
  { serviceType: "Monthly Cleanup", frequency: 1, month: "August" },
  { serviceType: "Fertilization", frequency: 1, month: "August" },
  { serviceType: "Hedge Trimming", frequency: 2, month: "August" },
  { serviceType: "Leaf Removal", frequency: 1, month: "August" },
  { serviceType: "Irrigation Check", frequency: 2, month: "August" },
  { serviceType: "Mulch Installation", frequency: 1, month: "August" },
  { serviceType: "Tree Pruning", frequency: 1, month: "August" },
  { serviceType: "Plant Installation", frequency: 1, month: "August" },
  { serviceType: "Hardscape Installation", frequency: 1, month: "August" },
  { serviceType: "Seasonal Color Change", frequency: 1, month: "August" },
  { serviceType: "Pest Control Treatment", frequency: 2, month: "August" },
  { serviceType: "Soil Amendment", frequency: 1, month: "August" },
  { serviceType: "Aeration & Overseeding", frequency: 1, month: "August" },
  { serviceType: "Irrigation Repair", frequency: 1, month: "August" },
  { serviceType: "Landscape Design", frequency: 1, month: "August" },
  { serviceType: "Sod Installation", frequency: 1, month: "August" },
  { serviceType: "Drainage Solutions", frequency: 1, month: "August" },
];

// Mock Contracts with realistic landscaping businesses (August 2025)
export const mockContracts: Contract[] = [
  {
    id: "contract-001",
    clientName: "Sunset Plaza Shopping Center",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "August" },
      { serviceType: "Irrigation Check", frequency: 2, month: "August" }
    ]
  },
  {
    id: "contract-002", 
    clientName: "Riverside Elementary School",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Fertilization", frequency: 1, month: "August" },
      { serviceType: "Pest Control Treatment", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-003",
    clientName: "Oak Hill Residential Complex",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "August" },
      { serviceType: "Seasonal Color Change", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-004",
    clientName: "Downtown Medical Center", 
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "August" },
      { serviceType: "Plant Installation", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-005",
    clientName: "Pinewood Country Club",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Irrigation Check", frequency: 2, month: "August" },
      { serviceType: "Aeration & Overseeding", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-006",
    clientName: "Maple Street Office Park",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Mulch Installation", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-007",
    clientName: "Greenfield Apartments",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Leaf Removal", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-008",
    clientName: "City Hall Complex",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "August" }
    ]
  },
  {
    id: "contract-009",
    clientName: "Westside Community Center",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-010",
    clientName: "Heritage Park",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Fertilization", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-011",
    clientName: "Lakeside Business District",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Irrigation Check", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-012",
    clientName: "Northgate Shopping Mall",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Mulch Installation", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-013",
    clientName: "Sunrise Senior Living",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "August" }
    ]
  },
  {
    id: "contract-014",
    clientName: "Industrial Park East",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-015",
    clientName: "Hillcrest Hospital",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Leaf Removal", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-016",
    clientName: "Valley View Condos",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Fertilization", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-017",
    clientName: "Central Library",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Irrigation Check", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-018",
    clientName: "Eastside Fire Station",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Hedge Trimming", frequency: 2, month: "August" }
    ]
  },
  {
    id: "contract-019",
    clientName: "Brookside Elementary",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Monthly Cleanup", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-020",
    clientName: "Southgate Plaza",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Mulch Installation", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-021",
    clientName: "Mountain View Offices",
    services: [
      { serviceType: "Weekly Mowing", frequency: 4, month: "August" },
      { serviceType: "Leaf Removal", frequency: 1, month: "August" }
    ]
  },
  {
    id: "contract-022",
    clientName: "Riverside Park",
    services: [
      { serviceType: "Bi-weekly Mowing", frequency: 2, month: "August" },
      { serviceType: "Fertilization", frequency: 1, month: "August" }
    ]
  }
];

// Mock Job Tickets (50+ job tickets with realistic coordinates around a central area)
export const mockJobTickets: JobTicket[] = [
  // Premium Commercial Properties
  {
    id: "job-001",
    clientId: "contract-001",
    address: "1234 Sunset Plaza Dr, Beverly Hills, CA 90210",
    lat: 34.0928,
    long: -118.2737,
    task: "Premium Maintenance Package - Mow 15,000 sq ft, edge all walkways, blow clean parking areas, inspect irrigation zones 1-4",
    estimatedHours: 3.5,
    requiredEquipment: ["72\" Zero-turn Mower", "Commercial Edger", "Backpack Blower", "Irrigation Multimeter"],
    requiredMaterials: ["Premium Fuel Mix", "Trimmer Line", "Irrigation Flags"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-002", 
    clientId: "contract-002",
    address: "5678 Riverside Elementary Way, Glendale, CA 91201",
    lat: 34.1028,
    long: -118.2637,
    task: "School Grounds Maintenance - Mow athletic fields, trim around playground equipment, apply organic pest control to garden areas",
    estimatedHours: 4.0,
    requiredEquipment: ["Sports Field Mower", "Safety Trimmer", "Organic Sprayer", "Safety Cones"],
    requiredMaterials: ["Organic Pesticide", "Trimmer Line", "Field Marking Paint"],
    serviceType: "Bi-weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-003",
    clientId: "contract-003", 
    address: "9012 Oak Hill Luxury Residences, Pasadena, CA 91103",
    lat: 34.1128,
    long: -118.2537,
    task: "Luxury Complex Care - Precision mowing, topiary hedge shaping, seasonal flower bed refresh with fall mums and ornamental kale",
    estimatedHours: 5.5,
    requiredEquipment: ["Precision Mower", "Topiary Shears", "Planting Tools", "Mulch Spreader"],
    requiredMaterials: ["Fall Annuals", "Premium Mulch", "Slow-release Fertilizer"],
    serviceType: "Weekly Mowing",
    priority: "high", 
    status: "pending"
  },
  {
    id: "job-004",
    clientId: "contract-004",
    address: "3456 Medical Plaza, Burbank, CA 91501",
    lat: 34.0828,
    long: -118.2837,
    task: "Healthcare Facility Grounds - Therapeutic garden maintenance, healing plant care, accessible pathway clearing",
    estimatedHours: 3.0,
    requiredEquipment: ["Quiet Electric Mower", "Precision Pruners", "Pathway Blower"],
    requiredMaterials: ["Organic Plant Food", "Therapeutic Herbs", "Pathway Sand"],
    serviceType: "Bi-weekly Mowing",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-005",
    clientId: "contract-005",
    address: "7890 Pinewood Country Club, La Cañada, CA 91011",
    lat: 34.1228,
    long: -118.2437,
    task: "Championship Course Maintenance - Fairway conditioning, green aeration prep, bunker edge definition, tee box overseeding",
    estimatedHours: 6.0,
    requiredEquipment: ["Fairway Mower", "Aerator", "Bunker Rake", "Overseeder"],
    requiredMaterials: ["Bentgrass Seed", "Topdressing Sand", "Course Fertilizer"],
    serviceType: "Weekly Mowing",
    priority: "high",
    status: "pending"
  },
  // Specialized Landscaping Services
  {
    id: "job-006",
    clientId: "contract-006",
    address: "2468 Maple Corporate Center, Sherman Oaks, CA 91403",
    lat: 34.0728,
    long: -118.2937,
    task: "Corporate Campus Enhancement - Install drought-resistant native plant display, upgrade drip irrigation system, create executive parking landscape buffer",
    estimatedHours: 8.0,
    requiredEquipment: ["Mini Excavator", "Trenching Shovel", "Drip Installation Kit", "Plant Auger"],
    requiredMaterials: ["Native California Plants", "Drip Tubing", "Decorative Gravel", "Landscape Fabric"],
    serviceType: "Plant Installation",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-007",
    clientId: "contract-007",
    address: "1357 Greenfield Luxury Apartments, West Hollywood, CA 90069",
    lat: 34.1328,
    long: -118.2337,
    task: "Residential Complex Beautification - Prune mature olive trees, install seasonal color rotation (summer to fall transition), repair automatic irrigation timer system",
    estimatedHours: 6.5,
    requiredEquipment: ["Pole Pruner", "Bucket Truck", "Irrigation Timer", "Color Planting Tools"],
    requiredMaterials: ["Fall Pansies", "Ornamental Cabbage", "Tree Wound Sealant", "Irrigation Components"],
    serviceType: "Tree Pruning",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-008",
    clientId: "contract-008",
    address: "8642 City Hall Civic Center, Los Angeles, CA 90012",
    lat: 34.0628,
    long: -118.3037,
    task: "Municipal Grounds Excellence - Maintain formal hedge maze, power wash memorial fountain, apply pre-emergent herbicide to ceremonial lawn areas",
    estimatedHours: 4.5,
    requiredEquipment: ["Precision Hedge Trimmer", "Pressure Washer", "Broadcast Spreader", "Safety Equipment"],
    requiredMaterials: ["Pre-emergent Herbicide", "Fountain Cleaning Solution", "Hedge Fertilizer"],
    serviceType: "Hedge Trimming",
    priority: "high",
    status: "pending"
  },
  {
    id: "job-009",
    clientId: "contract-009",
    address: "9753 Westside Community Hub, Santa Monica, CA 90405",
    lat: 34.1428,
    long: -118.2237,
    task: "Community Space Revitalization - Install children's sensory garden with aromatic herbs, repair playground shade structure irrigation, mulch walking trails",
    estimatedHours: 7.0,
    requiredEquipment: ["Garden Tiller", "Irrigation Repair Kit", "Mulch Spreader", "Hand Tools"],
    requiredMaterials: ["Sensory Plants (Lavender, Mint, Rosemary)", "Playground Mulch", "Irrigation Fittings"],
    serviceType: "Plant Installation",
    priority: "medium",
    status: "pending"
  },
  {
    id: "job-010",
    clientId: "contract-010",
    address: "4681 Heritage Historic Park, Pasadena, CA 91106",
    lat: 34.0528,
    long: -118.3137,
    task: "Historic Landscape Preservation - Restore heritage rose garden with period-appropriate varieties, repair Victorian-era fountain plumbing, maintain heritage oak trees",
    estimatedHours: 9.0,
    requiredEquipment: ["Rose Planting Tools", "Plumbing Snake", "Tree Assessment Equipment", "Period Garden Tools"],
    requiredMaterials: ["Heritage Rose Varieties", "Fountain Pump Parts", "Organic Rose Fertilizer", "Tree Support Stakes"],
    serviceType: "Landscape Design",
    priority: "high",
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

// Mock Weather Forecasts for August 2025 - Detailed Southern California Weather
export const mockWeatherForecasts: WeatherForecast[] = [
  {
    date: "2025-08-16", // Demo day - Saturday
    alerts: [
      {
        type: "heat",
        severity: "high",
        startTime: "11:00",
        endTime: "17:00",
        description: "Excessive Heat Warning - Temperatures reaching 95°F. Implement heat safety protocols for outdoor crews."
      },
      {
        type: "air_quality",
        severity: "medium", 
        startTime: "06:00",
        endTime: "23:59",
        description: "Moderate Air Quality Alert - Sensitive individuals should limit prolonged outdoor exertion."
      }
    ],
    temperature: { high: 95, low: 72 },
    conditions: "Hot & Sunny",
    humidity: 45,
    windSpeed: 8,
    uvIndex: 9
  },
  {
    date: "2025-08-17", // Sunday
    alerts: [
      {
        type: "wind",
        severity: "medium",
        startTime: "13:00", 
        endTime: "19:00",
        description: "Santa Ana Wind Advisory - Gusts up to 35 mph. Secure equipment and avoid tree work."
      }
    ],
    temperature: { high: 89, low: 69 },
    conditions: "Sunny & Windy",
    humidity: 35,
    windSpeed: 25,
    uvIndex: 8
  },
  {
    date: "2025-08-18", // Monday
    alerts: [],
    temperature: { high: 84, low: 68 },
    conditions: "Perfect Weather",
    humidity: 55,
    windSpeed: 5,
    uvIndex: 7
  },
  {
    date: "2025-08-19", // Tuesday
    alerts: [
      {
        type: "rain",
        severity: "low",
        startTime: "15:00",
        endTime: "18:00", 
        description: "Light afternoon showers possible - 30% chance. Monitor radar for irrigation scheduling."
      }
    ],
    temperature: { high: 79, low: 65 },
    conditions: "Partly Cloudy",
    humidity: 65,
    windSpeed: 7,
    uvIndex: 6
  },
  {
    date: "2025-08-20", // Wednesday
    alerts: [
      {
        type: "fire",
        severity: "high",
        startTime: "00:00",
        endTime: "23:59",
        description: "Red Flag Warning - Critical fire weather conditions. No spark-producing equipment during peak hours (10 AM - 6 PM)."
      }
    ],
    temperature: { high: 92, low: 71 },
    conditions: "Hot & Dry",
    humidity: 25,
    windSpeed: 15,
    uvIndex: 9
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
