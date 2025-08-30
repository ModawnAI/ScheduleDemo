// Weather API utilities with TypeScript and CSS variable integration
import { WeatherAlert, WeatherForecast } from '@/types';
import { mockWeatherForecasts } from '@/data/mockData';

/**
 * Weather severity levels with corresponding chart color classes
 */
export const WEATHER_SEVERITY_COLORS = {
  low: 'text-chart-2 bg-chart-2/10 border-chart-2/20',
  medium: 'text-chart-3 bg-chart-3/10 border-chart-3/20', 
  high: 'text-chart-5 bg-chart-5/10 border-chart-5/20',
  critical: 'text-red-700 bg-red-100 border-red-300'
} as const;

/**
 * Weather type configurations with icons and colors
 */
export const WEATHER_TYPE_CONFIG = {
  rain: {
    icon: 'CloudRain',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/20',
    description: 'Rain conditions may affect outdoor work'
  },
  snow: {
    icon: 'Snowflake',
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/20',
    description: 'Snow conditions may delay operations'
  },
  wind: {
    icon: 'Wind',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    borderColor: 'border-chart-3/20',
    description: 'High winds may affect equipment safety'
  },
  heat: {
    icon: 'Sun',
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    borderColor: 'border-chart-1/20',
    description: 'Extreme heat may require schedule adjustments'
  },
  fire: {
    icon: 'Sun',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Fire danger - restrict spark-producing equipment'
  },
  air_quality: {
    icon: 'Wind',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Poor air quality may affect sensitive crew members'
  },
  frost: {
    icon: 'Snowflake',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Frost conditions may damage sensitive plants'
  },
  flood: {
    icon: 'CloudRain',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'Flooding may prevent access to job sites'
  }
} as const;

/**
 * Convert mockWeatherForecasts array to lookup object for compatibility
 */
const MOCK_WEATHER_DATA: Record<string, WeatherForecast> = mockWeatherForecasts.reduce((acc, forecast) => {
  acc[forecast.date] = forecast;
  return acc;
}, {} as Record<string, WeatherForecast>);

/**
 * Mock Weather API - simulates real weather service
 * @param date ISO date string (e.g., "2024-09-16")
 * @param location Optional location (not used in mock, but included for API compatibility)
 * @returns Promise<WeatherForecast>
 */
export async function mockWeatherAPI(
  date: string, 
  location?: { lat: number; lng: number }
): Promise<WeatherForecast> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Return mock data or generate random weather if date not in mock data
  if (MOCK_WEATHER_DATA[date]) {
    return MOCK_WEATHER_DATA[date];
  }
  
  // Generate random weather for unknown dates
  return generateRandomWeather(date, location);
}

/**
 * Generate random weather data for dates not in mock data
 */
function generateRandomWeather(
  date: string, 
  location?: { lat: number; lng: number }
): WeatherForecast {
  const weatherTypes: Array<WeatherAlert['type']> = ['rain', 'snow', 'wind', 'heat'];
  const severities: Array<WeatherAlert['severity']> = ['low', 'medium', 'high'];
  const conditions = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Overcast', 
    'Light Rain', 'Heavy Rain', 'Snow Showers', 'Windy'
  ];
  
  const alerts: WeatherAlert[] = [];
  const alertCount = Math.random() < 0.3 ? 0 : Math.random() < 0.7 ? 1 : 2;
  
  for (let i = 0; i < alertCount; i++) {
    const type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const startHour = 6 + Math.floor(Math.random() * 12);
    const duration = 2 + Math.floor(Math.random() * 6);
    
    alerts.push({
      type,
      severity,
      startTime: `${startHour.toString().padStart(2, '0')}:00`,
      endTime: `${(startHour + duration).toString().padStart(2, '0')}:00`,
      description: WEATHER_TYPE_CONFIG[type].description
    });
  }
  
  // Generate temperature based on season (simplified)
  const baseTemp = location?.lat ? (location.lat > 40 ? 65 : 75) : 70;
  const variation = 20;
  const high = baseTemp + Math.floor(Math.random() * variation);
  const low = high - 10 - Math.floor(Math.random() * 15);
  
  return {
    date,
    alerts,
    temperature: { high, low },
    conditions: conditions[Math.floor(Math.random() * conditions.length)]
  };
}

/**
 * Get weather alerts for multiple dates
 * @param dates Array of ISO date strings
 * @param location Optional location
 * @returns Promise<WeatherForecast[]>
 */
export async function getWeatherForDates(
  dates: string[], 
  location?: { lat: number; lng: number }
): Promise<WeatherForecast[]> {
  const promises = dates.map(date => mockWeatherAPI(date, location));
  return Promise.all(promises);
}

/**
 * Check if weather conditions affect outdoor work
 * @param forecast WeatherForecast to analyze
 * @param currentTime Current time in "HH:MM" format
 * @returns Object with impact assessment
 */
export function assessWeatherImpact(
  forecast: WeatherForecast, 
  currentTime: string = new Date().toTimeString().slice(0, 5)
): {
  hasActiveAlerts: boolean;
  activeAlerts: WeatherAlert[];
  impactLevel: 'none' | 'low' | 'medium' | 'high';
  recommendations: string[];
  shouldDispatch: boolean;
} {
  const currentMinutes = timeToMinutes(currentTime);
  
  const activeAlerts = forecast.alerts.filter(alert => {
    const startMinutes = timeToMinutes(alert.startTime);
    const endMinutes = timeToMinutes(alert.endTime);
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
  
  const hasActiveAlerts = activeAlerts.length > 0;
  
  // Determine impact level
  let impactLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (hasActiveAlerts) {
    const maxSeverity = Math.max(...activeAlerts.map(alert => {
      switch (alert.severity) {
        case 'low': return 1;
        case 'medium': return 2;
        case 'high': return 3;
        default: return 0;
      }
    }));
    
    if (maxSeverity >= 3) impactLevel = 'high';
    else if (maxSeverity >= 2) impactLevel = 'medium';
    else if (maxSeverity >= 1) impactLevel = 'low';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  activeAlerts.forEach(alert => {
    switch (alert.type) {
      case 'rain':
        if (alert.severity === 'high') {
          recommendations.push('Consider postponing outdoor work');
          recommendations.push('Ensure equipment is waterproofed');
        } else {
          recommendations.push('Monitor conditions closely');
          recommendations.push('Have rain gear available');
        }
        break;
      case 'wind':
        recommendations.push('Avoid tree work and tall equipment');
        recommendations.push('Secure loose materials');
        break;
      case 'heat':
        recommendations.push('Schedule frequent breaks');
        recommendations.push('Ensure adequate hydration');
        recommendations.push('Consider earlier start times');
        recommendations.push('Implement heat safety protocols');
        break;
      case 'snow':
        recommendations.push('Check road conditions');
        recommendations.push('Allow extra travel time');
        break;
      case 'fire':
        recommendations.push('No spark-producing equipment during peak hours');
        recommendations.push('Have fire extinguishers readily available');
        recommendations.push('Monitor local fire restrictions');
        break;
      case 'air_quality':
        recommendations.push('Limit prolonged outdoor exertion');
        recommendations.push('Provide masks for sensitive crew members');
        recommendations.push('Monitor air quality index');
        break;
      case 'frost':
        recommendations.push('Protect sensitive plants');
        recommendations.push('Delay irrigation until temperatures rise');
        break;
      case 'flood':
        recommendations.push('Avoid low-lying areas');
        recommendations.push('Check road accessibility');
        recommendations.push('Postpone work in affected areas');
        break;
    }
  });
  
  // Determine if crews should be dispatched
  const shouldDispatch = impactLevel !== 'high' && (
    impactLevel === 'none' || 
    (impactLevel === 'low' && activeAlerts.every(alert => alert.type !== 'snow')) ||
    (impactLevel === 'medium' && activeAlerts.every(alert => alert.type === 'wind' || alert.type === 'heat'))
  );
  
  return {
    hasActiveAlerts,
    activeAlerts,
    impactLevel,
    recommendations,
    shouldDispatch
  };
}

/**
 * Get CSS classes for weather alert styling
 * @param alert WeatherAlert
 * @returns Object with CSS classes
 */
export function getWeatherAlertStyling(alert: WeatherAlert): {
  containerClass: string;
  iconClass: string;
  textClass: string;
} {
  const typeConfig = WEATHER_TYPE_CONFIG[alert.type];
  const severityConfig = WEATHER_SEVERITY_COLORS[alert.severity];
  
  return {
    containerClass: `${typeConfig.bgColor} ${typeConfig.borderColor} border`,
    iconClass: typeConfig.color,
    textClass: severityConfig.split(' ')[0] // Extract text color class
  };
}

/**
 * Get weather condition emoji for display
 * @param conditions Weather conditions string
 * @returns Emoji string
 */
export function getWeatherEmoji(conditions: string): string {
  const condition = conditions.toLowerCase();
  if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
  if (condition.includes('partly cloudy')) return '⛅';
  if (condition.includes('cloudy') || condition.includes('overcast')) return '☁️';
  if (condition.includes('rain') || condition.includes('shower')) return '🌧️';
  if (condition.includes('snow')) return '❄️';
  if (condition.includes('wind')) return '💨';
  if (condition.includes('storm')) return '⛈️';
  if (condition.includes('hot') || condition.includes('heat')) return '🔥';
  return '🌤️'; // Default
}

/**
 * Format temperature for display
 * @param temp Temperature number
 * @returns Formatted temperature string
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°F`;
}

/**
 * Convert time string to minutes since midnight
 * @param time Time string in "HH:MM" format
 * @returns Minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get weather alert priority for sorting
 * @param alert WeatherAlert
 * @returns Priority number (higher = more important)
 */
export function getWeatherAlertPriority(alert: WeatherAlert): number {
  const severityWeight = { low: 1, medium: 2, high: 3, critical: 4 }[alert.severity];
  const typeWeight = { wind: 4, snow: 3, rain: 2, heat: 1, fire: 5, air_quality: 2, frost: 2, flood: 4 }[alert.type] || 1;
  return severityWeight * 10 + typeWeight;
}

/**
 * Sort weather alerts by priority (most important first)
 * @param alerts Array of WeatherAlert
 * @returns Sorted array
 */
export function sortWeatherAlertsByPriority(alerts: WeatherAlert[]): WeatherAlert[] {
  return [...alerts].sort((a, b) => getWeatherAlertPriority(b) - getWeatherAlertPriority(a));
}
