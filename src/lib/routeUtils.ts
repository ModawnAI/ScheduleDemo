// Route calculation utilities with TypeScript and CSS variable integration
import { JobTicket, RouteMetrics, RoutePoint } from '@/types';

/**
 * Haversine formula to calculate distance between two points on Earth
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in miles
 */
export function calculateHaversineDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate comprehensive route metrics for a crew's job sequence
 * @param jobs Array of job tickets in route order
 * @param startLocation Optional starting location (defaults to first job)
 * @returns RouteMetrics with drive time, billable hours, distance, and fuel cost
 */
export function calculateRouteMetrics(
  jobs: JobTicket[], 
  startLocation?: { lat: number; lng: number }
): RouteMetrics {
  if (jobs.length === 0) {
    return {
      driveTime: 0,
      billableHours: 0,
      totalDistance: 0,
      fuelCost: 0
    };
  }

  let totalDistance = 0;
  let totalBillableHours = 0;
  let totalDriveTime = 0;

  // Calculate billable hours
  totalBillableHours = jobs.reduce((sum, job) => sum + job.estimatedHours, 0);

  // Calculate route distances
  const currentLat = startLocation?.lat || jobs[0].lat;
  const currentLng = startLocation?.lng || jobs[0].long;

  // If we have a start location different from first job, add that distance
  if (startLocation && jobs.length > 0) {
    const distanceToFirst = calculateHaversineDistance(
      currentLat, currentLng, jobs[0].lat, jobs[0].long
    );
    totalDistance += distanceToFirst;
  }

  // Calculate distances between consecutive jobs
  for (let i = 0; i < jobs.length - 1; i++) {
    const distance = calculateHaversineDistance(
      jobs[i].lat, jobs[i].long,
      jobs[i + 1].lat, jobs[i + 1].long
    );
    totalDistance += distance;
  }

  // Estimate drive time (assuming average speed of 25 mph in urban areas)
  const averageSpeedMph = 25;
  totalDriveTime = Math.round((totalDistance / averageSpeedMph) * 60); // Convert to minutes

  // Calculate fuel cost (assuming 20 MPG and $3.50/gallon)
  const mpg = 20;
  const fuelPricePerGallon = 3.50;
  const fuelCost = Math.round((totalDistance / mpg) * fuelPricePerGallon * 100) / 100;

  return {
    driveTime: totalDriveTime,
    billableHours: Math.round(totalBillableHours * 100) / 100,
    totalDistance: Math.round(totalDistance * 100) / 100,
    fuelCost
  };
}

/**
 * Calculate route efficiency score (0-100)
 * Based on ratio of billable time to total time
 */
export function calculateRouteEfficiency(metrics: RouteMetrics): number {
  const totalTimeHours = (metrics.driveTime / 60) + metrics.billableHours;
  if (totalTimeHours === 0) return 0;
  
  const efficiency = (metrics.billableHours / totalTimeHours) * 100;
  return Math.round(efficiency * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert jobs array to route points with estimated arrival/departure times
 * @param jobs Array of job tickets
 * @param startTime Start time in "HH:MM" format
 * @param metrics Pre-calculated route metrics
 */
export function calculateRouteTimeline(
  jobs: JobTicket[], 
  startTime: string = "08:00",
  metrics?: RouteMetrics
): RoutePoint[] {
  if (jobs.length === 0) return [];

  const routeMetrics = metrics || calculateRouteMetrics(jobs);
  const routePoints: RoutePoint[] = [];
  
  // Parse start time
  const [startHour, startMinute] = startTime.split(':').map(Number);
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  // Estimate travel time between jobs
  const avgTravelTimePerJob = routeMetrics.driveTime / Math.max(jobs.length - 1, 1);

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    
    // Add travel time to get to this job (except for first job)
    if (i > 0) {
      currentTime = new Date(currentTime.getTime() + (avgTravelTimePerJob * 60 * 1000));
    }

    const estimatedArrival = formatTime(currentTime);
    
    // Add job duration
    const jobDurationMs = job.estimatedHours * 60 * 60 * 1000;
    const departureTime = new Date(currentTime.getTime() + jobDurationMs);
    const estimatedDeparture = formatTime(departureTime);

    routePoints.push({
      jobTicketId: job.id,
      address: job.address,
      lat: job.lat,
      lng: job.long,
      estimatedArrival,
      estimatedDeparture
    });

    // Update current time for next iteration
    currentTime = departureTime;
  }

  return routePoints;
}

/**
 * Format time to HH:MM AM/PM format
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Get route optimization suggestions based on metrics
 */
export function getRouteOptimizationSuggestions(
  jobs: JobTicket[], 
  metrics: RouteMetrics
): string[] {
  const suggestions: string[] = [];
  const efficiency = calculateRouteEfficiency(metrics);

  if (efficiency < 70) {
    suggestions.push("Consider reordering jobs to minimize travel time");
  }

  if (metrics.totalDistance && metrics.totalDistance > 50) {
    suggestions.push("Route covers significant distance - consider splitting across multiple crews");
  }

  if (metrics.driveTime > 120) { // More than 2 hours of driving
    suggestions.push("High drive time detected - optimize job sequence");
  }

  const avgJobTime = metrics.billableHours / jobs.length;
  if (avgJobTime < 1) {
    suggestions.push("Many short jobs - consider batching nearby locations");
  }

  if (jobs.some(job => job.priority === 'high')) {
    suggestions.push("Prioritize high-priority jobs earlier in the route");
  }

  return suggestions;
}

/**
 * Calculate metrics comparison between two routes
 */
export function compareRouteMetrics(
  currentMetrics: RouteMetrics, 
  newMetrics: RouteMetrics
): {
  driveTimeChange: number;
  distanceChange: number;
  fuelCostChange: number;
  efficiencyChange: number;
} {
  const currentEfficiency = calculateRouteEfficiency(currentMetrics);
  const newEfficiency = calculateRouteEfficiency(newMetrics);

  return {
    driveTimeChange: newMetrics.driveTime - currentMetrics.driveTime,
    distanceChange: (newMetrics.totalDistance || 0) - (currentMetrics.totalDistance || 0),
    fuelCostChange: (newMetrics.fuelCost || 0) - (currentMetrics.fuelCost || 0),
    efficiencyChange: newEfficiency - currentEfficiency
  };
}

/**
 * Debounced function utility for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get color class based on metric change (for CSS variable integration)
 */
export function getMetricChangeColor(change: number, isInverse: boolean = false): string {
  if (change === 0) return 'text-muted-foreground';
  
  const isPositive = isInverse ? change < 0 : change > 0;
  return isPositive ? 'text-chart-1' : 'text-chart-4';
}

/**
 * Get background color class for metric changes
 */
export function getMetricChangeBg(change: number, isInverse: boolean = false): string {
  if (change === 0) return 'bg-muted/50';
  
  const isPositive = isInverse ? change < 0 : change > 0;
  return isPositive ? 'bg-chart-1/10' : 'bg-chart-4/10';
}
