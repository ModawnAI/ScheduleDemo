import {
  mockContracts,
  mockCrews,
  mockJobTickets,
  mockDailySchedules,
  mockWeatherForecasts,
  mockCalendarEvents,
  getJobsByDate,
  getCrewScheduleByDate,
  getWeatherByDate,
  getContractByClient
} from './mockData';

// Validation results interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    contractsCount: number;
    crewsCount: number;
    jobTicketsCount: number;
    dailySchedulesCount: number;
    weatherForecastsCount: number;
    calendarEventsCount: number;
  };
}

// Validate data completeness and relationships
export function validateMockData(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    summary: {
      contractsCount: mockContracts.length,
      crewsCount: mockCrews.length,
      jobTicketsCount: mockJobTickets.length,
      dailySchedulesCount: mockDailySchedules.length,
      weatherForecastsCount: mockWeatherForecasts.length,
      calendarEventsCount: mockCalendarEvents.length
    }
  };

  // Validate minimum data requirements
  if (mockContracts.length < 20) {
    result.errors.push(`Insufficient contracts: ${mockContracts.length} (minimum: 20)`);
    result.isValid = false;
  }

  if (mockCrews.length < 3) {
    result.errors.push(`Insufficient crews: ${mockCrews.length} (minimum: 3)`);
    result.isValid = false;
  }

  if (mockJobTickets.length < 20) {
    result.warnings.push(`Low job ticket count: ${mockJobTickets.length} (recommended: 50+)`);
  }

  // Validate contract structure
  mockContracts.forEach((contract, index) => {
    if (!contract.id || !contract.clientName || !contract.services) {
      result.errors.push(`Contract ${index}: Missing required fields`);
      result.isValid = false;
    }

    if (contract.services.length === 0) {
      result.warnings.push(`Contract ${contract.id}: No services defined`);
    }

    contract.services.forEach((service, serviceIndex) => {
      if (!service.serviceType || !service.frequency || !service.month) {
        result.errors.push(`Contract ${contract.id}, Service ${serviceIndex}: Missing required fields`);
        result.isValid = false;
      }
    });
  });

  // Validate crew structure
  mockCrews.forEach((crew, index) => {
    if (!crew.id || !crew.name || !crew.specialization || !crew.members) {
      result.errors.push(`Crew ${index}: Missing required fields`);
      result.isValid = false;
    }

    if (crew.members.length === 0) {
      result.warnings.push(`Crew ${crew.id}: No members assigned`);
    }

    crew.members.forEach((member, memberIndex) => {
      if (!member.id || !member.name || !member.role) {
        result.errors.push(`Crew ${crew.id}, Member ${memberIndex}: Missing required fields`);
        result.isValid = false;
      }
    });
  });

  // Validate job tickets structure and relationships
  mockJobTickets.forEach((job, index) => {
    if (!job.id || !job.clientId || !job.address || !job.task) {
      result.errors.push(`Job ${index}: Missing required fields`);
      result.isValid = false;
    }

    if (typeof job.lat !== 'number' || typeof job.long !== 'number') {
      result.errors.push(`Job ${job.id}: Invalid coordinates`);
      result.isValid = false;
    }

    if (job.estimatedHours <= 0) {
      result.errors.push(`Job ${job.id}: Invalid estimated hours`);
      result.isValid = false;
    }

    // Check if clientId references a valid contract
    const contract = mockContracts.find(c => c.id === job.clientId);
    if (!contract) {
      result.errors.push(`Job ${job.id}: References non-existent contract ${job.clientId}`);
      result.isValid = false;
    }

    // Validate coordinate ranges (Los Angeles area)
    if (job.lat < 34.0 || job.lat > 34.2 || job.long < -118.4 || job.long > -118.1) {
      result.warnings.push(`Job ${job.id}: Coordinates may be outside expected area`);
    }
  });

  // Validate daily schedules structure and relationships
  mockDailySchedules.forEach((schedule, index) => {
    if (!schedule.date || !schedule.crewSchedules) {
      result.errors.push(`Daily Schedule ${index}: Missing required fields`);
      result.isValid = false;
    }

    schedule.crewSchedules.forEach((crewSchedule, crewIndex) => {
      if (!crewSchedule.crewId || !crewSchedule.route || !crewSchedule.metrics) {
        result.errors.push(`Schedule ${schedule.date}, Crew ${crewIndex}: Missing required fields`);
        result.isValid = false;
      }

      // Check if crewId references a valid crew
      const crew = mockCrews.find(c => c.id === crewSchedule.crewId);
      if (!crew) {
        result.errors.push(`Schedule ${schedule.date}: References non-existent crew ${crewSchedule.crewId}`);
        result.isValid = false;
      }

      // Check if all job IDs in route reference valid jobs
      crewSchedule.route.forEach(jobId => {
        const job = mockJobTickets.find(j => j.id === jobId);
        if (!job) {
          result.errors.push(`Schedule ${schedule.date}, Crew ${crewSchedule.crewId}: References non-existent job ${jobId}`);
          result.isValid = false;
        }
      });

      // Validate metrics
      if (crewSchedule.metrics.driveTime < 0 || crewSchedule.metrics.billableHours < 0) {
        result.errors.push(`Schedule ${schedule.date}, Crew ${crewSchedule.crewId}: Invalid metrics`);
        result.isValid = false;
      }
    });
  });

  // Validate weather forecasts
  mockWeatherForecasts.forEach((forecast, index) => {
    if (!forecast.date || !forecast.temperature || !forecast.conditions) {
      result.errors.push(`Weather Forecast ${index}: Missing required fields`);
      result.isValid = false;
    }

    if (forecast.temperature.high <= forecast.temperature.low) {
      result.warnings.push(`Weather ${forecast.date}: High temp not greater than low temp`);
    }

    forecast.alerts.forEach((alert, alertIndex) => {
      if (!alert.type || !alert.severity || !alert.startTime || !alert.endTime) {
        result.errors.push(`Weather ${forecast.date}, Alert ${alertIndex}: Missing required fields`);
        result.isValid = false;
      }
    });
  });

  // Validate calendar events
  mockCalendarEvents.forEach((event, index) => {
    if (!event.id || !event.title || !event.date || !event.type || !event.clientName) {
      result.errors.push(`Calendar Event ${index}: Missing required fields`);
      result.isValid = false;
    }

    // Check if clientName references a valid contract
    const contract = getContractByClient(event.clientName);
    if (!contract) {
      result.warnings.push(`Calendar Event ${event.id}: Client name may not match any contract`);
    }
  });

  // Test helper functions
  try {
    const testJobs = getJobsByDate("2024-09-16");
    if (testJobs.length === 0) {
      result.warnings.push("No jobs found for demo date 2024-09-16");
    }

    const testCrewSchedule = getCrewScheduleByDate("2024-09-16", "crew-a");
    if (!testCrewSchedule) {
      result.warnings.push("No crew schedule found for crew-a on demo date");
    }

    const testWeather = getWeatherByDate("2024-09-16");
    if (!testWeather) {
      result.warnings.push("No weather forecast for demo date");
    }
  } catch (error) {
    result.errors.push(`Helper function error: ${error}`);
    result.isValid = false;
  }

  return result;
}

// Run validation and log results
export function runValidation(): void {
  console.log("🔍 Validating Mock Data...\n");
  
  const validation = validateMockData();
  
  console.log("📊 Data Summary:");
  console.log(`  Contracts: ${validation.summary.contractsCount}`);
  console.log(`  Crews: ${validation.summary.crewsCount}`);
  console.log(`  Job Tickets: ${validation.summary.jobTicketsCount}`);
  console.log(`  Daily Schedules: ${validation.summary.dailySchedulesCount}`);
  console.log(`  Weather Forecasts: ${validation.summary.weatherForecastsCount}`);
  console.log(`  Calendar Events: ${validation.summary.calendarEventsCount}\n`);

  if (validation.errors.length > 0) {
    console.log("❌ Errors:");
    validation.errors.forEach(error => console.log(`  - ${error}`));
    console.log();
  }

  if (validation.warnings.length > 0) {
    console.log("⚠️  Warnings:");
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    console.log();
  }

  if (validation.isValid) {
    console.log("✅ Validation passed! Mock data is ready for use.");
  } else {
    console.log("❌ Validation failed! Please fix the errors above.");
  }
}

// Export validation for use in tests or components
export default validateMockData;
