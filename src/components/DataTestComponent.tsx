"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';
import {
  mockContracts,
  mockCrews,
  mockJobTickets,
  mockDailySchedules,
  mockWeatherForecasts,
  getJobsByDate,
  getCrewScheduleByDate,
  getWeatherByDate
} from '@/data/mockData';
import { validateMockData, runValidation } from '@/data/validateData';
import { Contract, Crew, JobTicket, DailySchedule, WeatherForecast } from '@/types';

/**
 * Test component to verify data imports and TypeScript compilation
 * This component demonstrates that all types and data are properly imported and typed
 */
const DataTestComponent: React.FC = () => {
  // Test data imports
  const contracts: Contract[] = mockContracts;
  const crews: Crew[] = mockCrews;
  const jobTickets: JobTicket[] = mockJobTickets;
  const dailySchedules: DailySchedule[] = mockDailySchedules;
  const weatherForecasts: WeatherForecast[] = mockWeatherForecasts;

  // Test helper functions
  const demoDate = "2024-09-16";
  const demoJobs = getJobsByDate(demoDate);
  const demoCrewSchedule = getCrewScheduleByDate(demoDate, "crew-a");
  const demoWeather = getWeatherByDate(demoDate);

  // Test validation
  const validationResult = validateMockData();

  // Run console validation
  React.useEffect(() => {
    console.log("🧪 Running Data Test Component");
    runValidation();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Data Import Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contracts Test */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Contracts</h2>
          <p className="text-muted-foreground mb-2">
            Total: <span className="font-medium">{contracts.length}</span>
          </p>
          <div className="text-sm">
            <p><strong>Sample:</strong> {contracts[0]?.clientName}</p>
            <p><strong>Services:</strong> {contracts[0]?.services.length}</p>
          </div>
        </div>

        {/* Crews Test */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Crews</h2>
          <p className="text-muted-foreground mb-2">
            Total: <span className="font-medium">{crews.length}</span>
          </p>
          <div className="text-sm">
            <p><strong>Sample:</strong> {crews[0]?.name}</p>
            <p><strong>Specialization:</strong> {crews[0]?.specialization}</p>
            <p><strong>Members:</strong> {crews[0]?.members.length}</p>
          </div>
        </div>

        {/* Job Tickets Test */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Job Tickets</h2>
          <p className="text-muted-foreground mb-2">
            Total: <span className="font-medium">{jobTickets.length}</span>
          </p>
          <div className="text-sm">
            <p><strong>Sample:</strong> {jobTickets[0]?.task}</p>
            <p><strong>Hours:</strong> {jobTickets[0]?.estimatedHours}</p>
            <p><strong>Equipment:</strong> {jobTickets[0]?.requiredEquipment.length}</p>
          </div>
        </div>

        {/* Daily Schedules Test */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Daily Schedules</h2>
          <p className="text-muted-foreground mb-2">
            Total: <span className="font-medium">{dailySchedules.length}</span>
          </p>
          <div className="text-sm">
            <p><strong>Demo Date:</strong> {demoDate}</p>
            <p><strong>Jobs:</strong> {demoJobs.length}</p>
            <p><strong>Crew A Route:</strong> {demoCrewSchedule?.route.length || 0}</p>
          </div>
        </div>

        {/* Weather Test */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Weather Forecasts</h2>
          <p className="text-muted-foreground mb-2">
            Total: <span className="font-medium">{weatherForecasts.length}</span>
          </p>
          <div className="text-sm">
            <p><strong>Demo Weather:</strong> {demoWeather?.conditions}</p>
            <p><strong>High:</strong> {demoWeather?.temperature.high}°F</p>
            <p><strong>Alerts:</strong> {demoWeather?.alerts.length || 0}</p>
          </div>
        </div>

        {/* Validation Test */}
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Validation</h2>
          <p className="text-muted-foreground mb-2">
            Status: <span className={`font-medium ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validationResult.isValid ? 'Valid' : 'Invalid'}
            </span>
          </p>
          <div className="text-sm">
            <p><strong>Errors:</strong> {validationResult.errors.length}</p>
            <p><strong>Warnings:</strong> {validationResult.warnings.length}</p>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Type Safety Test</h2>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            All imports successful
            <CheckCircle className="w-4 h-4 text-green-600" />
            TypeScript compilation passed
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Contract Type:</strong> {typeof contracts[0]}</p>
              <p><strong>Crew Type:</strong> {typeof crews[0]}</p>
              <p><strong>Job Type:</strong> {typeof jobTickets[0]}</p>
            </div>
            <div>
              <p><strong>Schedule Type:</strong> {typeof dailySchedules[0]}</p>
              <p><strong>Weather Type:</strong> {typeof weatherForecasts[0]}</p>
              <p><strong>Validation Type:</strong> {typeof validationResult}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Data Display */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Sample Data</h2>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Demo Day Jobs ({demoDate})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {demoJobs.slice(0, 4).map(job => (
                <div key={job.id} className="bg-background p-2 rounded">
                  <p><strong>{job.task}</strong></p>
                  <p className="text-muted-foreground">{job.address}</p>
                  <p className="text-muted-foreground">{job.estimatedHours}h</p>
                </div>
              ))}
            </div>
          </div>

          {demoCrewSchedule && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Crew A Schedule</h3>
              <div className="text-sm">
                <p><strong>Start:</strong> {demoCrewSchedule.startTime}</p>
                <p><strong>End:</strong> {demoCrewSchedule.endTime}</p>
                <p><strong>Drive Time:</strong> {demoCrewSchedule.metrics.driveTime} min</p>
                <p><strong>Billable Hours:</strong> {demoCrewSchedule.metrics.billableHours}h</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTestComponent;
