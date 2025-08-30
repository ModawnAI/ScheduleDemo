"use client";

import React from 'react';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  Thermometer,
  CloudRain,
  Snowflake,
  Wind,
  Sun,
  Truck,
  Shield,
  Activity,
  Navigation,
  Timer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WeatherAlert, WeatherForecast, Crew, JobTicket } from '@/types';
import { 
  getWeatherEmoji, 
  formatTemperature,
  WEATHER_TYPE_CONFIG 
} from '@/lib/weatherUtils';

interface DispatchData {
  crewId?: string;
  jobIds: string[];
  dispatchTime: string;
  weatherConditions?: WeatherForecast;
  weatherOverrides?: string[];
  estimatedDuration?: number;
  specialInstructions?: string;
}

interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  dismissible?: boolean;
  showProgress?: boolean;
}

// Weather icon mapping
const WeatherIcons = {
  rain: CloudRain,
  snow: Snowflake,
  wind: Wind,
  heat: Sun,
  fire: Sun,
  air_quality: Wind,
  frost: Snowflake,
  flood: CloudRain
};

/**
 * Dispatch Success Notification System
 * Provides comprehensive toast notifications with chart color integration
 */
export class DispatchNotifications {
  
  /**
   * Show dispatch success notification with comprehensive details
   */
  static showDispatchSuccess(
    crew: Crew,
    jobs: JobTicket[],
    dispatchData: DispatchData,
    options: NotificationOptions = {}
  ) {
    const {
      duration = 6000,
      dismissible = true,
      showProgress = true
    } = options;

    const hasWeatherAlerts = (dispatchData.weatherConditions?.alerts.length || 0) > 0;
    const weatherOverrides = dispatchData.weatherOverrides?.length || 0;

    toast.success(
      <DispatchSuccessContent
        crew={crew}
        jobs={jobs}
        dispatchData={dispatchData}
        hasWeatherAlerts={hasWeatherAlerts}
        weatherOverrides={weatherOverrides}
      />,
      {
        duration,
        dismissible,
        className: cn(
          "bg-chart-1 text-primary-foreground border-chart-1",
          "shadow-lg rounded-lg p-0 overflow-hidden"
        ),
        style: {
          background: 'hsl(var(--chart-1))',
          color: 'hsl(var(--primary-foreground))',
          border: '1px solid hsl(var(--chart-1))'
        }
      }
    );
  }

  /**
   * Show weather override warning notification
   */
  static showWeatherOverrideWarning(
    alerts: WeatherAlert[],
    crew: Crew,
    options: NotificationOptions = {}
  ) {
    const {
      duration = 8000,
      dismissible = true
    } = options;

    const highRiskAlerts = alerts.filter(alert => alert.severity === 'high');
    const isHighRisk = highRiskAlerts.length > 0;

    toast.warning(
      <WeatherOverrideContent
        alerts={alerts}
        crew={crew}
        isHighRisk={isHighRisk}
      />,
      {
        duration,
        dismissible,
        className: cn(
          isHighRisk ? "bg-chart-5 text-primary-foreground border-chart-5" : "bg-chart-3 text-primary-foreground border-chart-3",
          "shadow-lg rounded-lg p-0 overflow-hidden"
        ),
        style: {
          background: isHighRisk ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-3))',
          color: 'hsl(var(--primary-foreground))',
          border: isHighRisk ? '1px solid hsl(var(--chart-5))' : '1px solid hsl(var(--chart-3))'
        }
      }
    );
  }

  /**
   * Show dispatch progress notification
   */
  static showDispatchProgress(
    crew: Crew,
    currentJob: JobTicket,
    progress: { completed: number; total: number; eta: string },
    options: NotificationOptions = {}
  ) {
    const {
      duration = 4000,
      dismissible = true
    } = options;

    toast.info(
      <DispatchProgressContent
        crew={crew}
        currentJob={currentJob}
        progress={progress}
      />,
      {
        duration,
        dismissible,
        className: cn(
          "bg-chart-2 text-primary-foreground border-chart-2",
          "shadow-lg rounded-lg p-0 overflow-hidden"
        ),
        style: {
          background: 'hsl(var(--chart-2))',
          color: 'hsl(var(--primary-foreground))',
          border: '1px solid hsl(var(--chart-2))'
        }
      }
    );
  }

  /**
   * Show dispatch error notification
   */
  static showDispatchError(
    error: string,
    crew?: Crew,
    options: NotificationOptions = {}
  ) {
    const {
      duration = 8000,
      dismissible = true
    } = options;

    toast.error(
      <DispatchErrorContent
        error={error}
        crew={crew}
      />,
      {
        duration,
        dismissible,
        className: cn(
          "bg-chart-5 text-primary-foreground border-chart-5",
          "shadow-lg rounded-lg p-0 overflow-hidden"
        ),
        style: {
          background: 'hsl(var(--chart-5))',
          color: 'hsl(var(--primary-foreground))',
          border: '1px solid hsl(var(--chart-5))'
        }
      }
    );
  }

  /**
   * Show route optimization notification
   */
  static showRouteOptimized(
    crew: Crew,
    savings: { time: number; distance: number; fuel: number },
    options: NotificationOptions = {}
  ) {
    const {
      duration = 5000,
      dismissible = true
    } = options;

    toast.success(
      <RouteOptimizedContent
        crew={crew}
        savings={savings}
      />,
      {
        duration,
        dismissible,
        className: cn(
          "bg-chart-1 text-primary-foreground border-chart-1",
          "shadow-lg rounded-lg p-0 overflow-hidden"
        ),
        style: {
          background: 'hsl(var(--chart-1))',
          color: 'hsl(var(--primary-foreground))',
          border: '1px solid hsl(var(--chart-1))'
        }
      }
    );
  }
}

// Notification Content Components

const DispatchSuccessContent: React.FC<{
  crew: Crew;
  jobs: JobTicket[];
  dispatchData: DispatchData;
  hasWeatherAlerts: boolean;
  weatherOverrides: number;
}> = ({ crew, jobs, dispatchData, hasWeatherAlerts, weatherOverrides }) => (
  <div className="p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary-foreground/20">
        <CheckCircle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">Crew Dispatched Successfully</h4>
        <p className="text-xs opacity-90">
          {crew.name} • {jobs.length} job{jobs.length !== 1 ? 's' : ''} • {Math.round((dispatchData.estimatedDuration || 0) / 60)}h estimated
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1">
        <Users className="w-3 h-3" />
        <span>{crew.members.length} members</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{new Date(dispatchData.dispatchTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}</span>
      </div>
      {dispatchData.weatherConditions && (
        <div className="flex items-center gap-1">
          <span className="text-sm">{getWeatherEmoji(dispatchData.weatherConditions.conditions)}</span>
          <span>{formatTemperature(dispatchData.weatherConditions.temperature.high)}</span>
        </div>
      )}
    </div>

    {hasWeatherAlerts && (
      <div className="flex items-center gap-2 p-2 rounded-md bg-primary-foreground/10">
        <Shield className="w-4 h-4" />
        <span className="text-xs">
          Weather alerts active • {weatherOverrides} override{weatherOverrides !== 1 ? 's' : ''}
        </span>
      </div>
    )}

    <div className="flex items-center justify-between">
      <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs">
        Dispatch #{dispatchData.crewId?.slice(-4) || 'XXXX'}
      </Badge>
      <div className="flex items-center gap-1 text-xs opacity-75">
        <Navigation className="w-3 h-3" />
        <span>Route optimized</span>
      </div>
    </div>
  </div>
);

const WeatherOverrideContent: React.FC<{
  alerts: WeatherAlert[];
  crew: Crew;
  isHighRisk: boolean;
}> = ({ alerts, crew, isHighRisk }) => (
  <div className="p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary-foreground/20">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">
          {isHighRisk ? 'High Risk Weather Override' : 'Weather Alert Override'}
        </h4>
        <p className="text-xs opacity-90">
          {crew.name} dispatched despite {alerts.length} active weather alert{alerts.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      {alerts.slice(0, 2).map((alert, index) => {
        const IconComponent = WeatherIcons[alert.type];
        return (
          <div key={index} className="flex items-center gap-2 text-xs">
            <IconComponent className="w-3 h-3" />
            <span className="capitalize">{alert.type} {alert.severity}</span>
            <span className="opacity-75">• {alert.startTime} - {alert.endTime}</span>
          </div>
        );
      })}
      {alerts.length > 2 && (
        <div className="text-xs opacity-75">
          +{alerts.length - 2} more alert{alerts.length - 2 !== 1 ? 's' : ''}
        </div>
      )}
    </div>

    <div className="flex items-center justify-between">
      <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs">
        Override Approved
      </Badge>
      <div className="flex items-center gap-1 text-xs opacity-75">
        <Shield className="w-3 h-3" />
        <span>Monitor conditions</span>
      </div>
    </div>
  </div>
);

const DispatchProgressContent: React.FC<{
  crew: Crew;
  currentJob: JobTicket;
  progress: { completed: number; total: number; eta: string };
}> = ({ crew, currentJob, progress }) => (
  <div className="p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary-foreground/20">
        <Activity className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">Crew En Route</h4>
        <p className="text-xs opacity-90">
          {crew.name} • Job {progress.completed + 1} of {progress.total}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{currentJob.clientId}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Timer className="w-3 h-3" />
        <span>ETA: {progress.eta}</span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex-1 bg-primary-foreground/20 rounded-full h-2 mr-3">
        <div 
          className="bg-primary-foreground h-2 rounded-full transition-all duration-300"
          style={{ width: `${(progress.completed / progress.total) * 100}%` }}
        />
      </div>
      <span className="text-xs opacity-75">
        {Math.round((progress.completed / progress.total) * 100)}%
      </span>
    </div>
  </div>
);

const DispatchErrorContent: React.FC<{
  error: string;
  crew?: Crew;
}> = ({ error, crew }) => (
  <div className="p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary-foreground/20">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">Dispatch Failed</h4>
        <p className="text-xs opacity-90">
          {crew ? `${crew.name} dispatch unsuccessful` : 'Unable to dispatch crew'}
        </p>
      </div>
    </div>

    <div className="text-xs opacity-90">
      {error}
    </div>

    <div className="flex items-center justify-between">
      <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs">
        Error
      </Badge>
      <div className="text-xs opacity-75">
        Please try again
      </div>
    </div>
  </div>
);

const RouteOptimizedContent: React.FC<{
  crew: Crew;
  savings: { time: number; distance: number; fuel: number };
}> = ({ crew, savings }) => (
  <div className="p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary-foreground/20">
        <Navigation className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">Route Optimized</h4>
        <p className="text-xs opacity-90">
          {crew.name} route has been improved
        </p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="text-center">
        <div className="font-medium">{savings.time}min</div>
        <div className="opacity-75">Time saved</div>
      </div>
      <div className="text-center">
        <div className="font-medium">{savings.distance}mi</div>
        <div className="opacity-75">Distance</div>
      </div>
      <div className="text-center">
        <div className="font-medium">${savings.fuel}</div>
        <div className="opacity-75">Fuel saved</div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs">
        Optimized
      </Badge>
      <div className="flex items-center gap-1 text-xs opacity-75">
        <CheckCircle className="w-3 h-3" />
        <span>Applied automatically</span>
      </div>
    </div>
  </div>
);

// Hook for easy notification usage
export const useDispatchNotifications = () => {
  return {
    showSuccess: DispatchNotifications.showDispatchSuccess,
    showWeatherOverride: DispatchNotifications.showWeatherOverrideWarning,
    showProgress: DispatchNotifications.showDispatchProgress,
    showError: DispatchNotifications.showDispatchError,
    showRouteOptimized: DispatchNotifications.showRouteOptimized
  };
};

export default DispatchNotifications;
