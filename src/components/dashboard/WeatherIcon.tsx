"use client";

import React from 'react';
import { 
  CloudRain, 
  Snowflake, 
  Wind, 
  Sun, 
  Cloud,
  CloudSnow,
  CloudLightning,
  Thermometer,
  Droplets,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WeatherAlert, WeatherForecast } from '@/types';
import { 
  getWeatherAlertStyling, 
  getWeatherEmoji, 
  formatTemperature,
  WEATHER_TYPE_CONFIG 
} from '@/lib/weatherUtils';

interface WeatherIconProps {
  alert?: WeatherAlert;
  forecast?: WeatherForecast;
  type?: 'alert' | 'condition' | 'temperature' | 'summary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  showBadge?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

// Icon mapping for weather types and conditions
const WeatherIcons = {
  // Alert types
  rain: CloudRain,
  snow: Snowflake,
  wind: Wind,
  heat: Sun,
  
  // Condition types
  sunny: Sun,
  'partly cloudy': Cloud,
  cloudy: Cloud,
  overcast: Cloud,
  'light rain': CloudRain,
  'heavy rain': CloudRain,
  'snow showers': CloudSnow,
  windy: Wind,
  storm: CloudLightning,
  
  // Utility icons
  temperature: Thermometer,
  humidity: Droplets,
  visibility: Eye,
  warning: AlertTriangle,
  success: CheckCircle,
  time: Clock,
  location: MapPin,
  calendar: Calendar,
  activity: Activity
};

const WeatherIcon: React.FC<WeatherIconProps> = ({
  alert,
  forecast,
  type = 'alert',
  size = 'md',
  showTooltip = true,
  showBadge = false,
  interactive = false,
  className,
  onClick
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { icon: 'w-4 h-4', container: 'p-1.5', badge: 'text-xs' },
    md: { icon: 'w-5 h-5', container: 'p-2', badge: 'text-xs' },
    lg: { icon: 'w-6 h-6', container: 'p-2.5', badge: 'text-sm' },
    xl: { icon: 'w-8 h-8', container: 'p-3', badge: 'text-sm' }
  };

  const config = sizeConfig[size];

  // Determine icon and styling based on type
  const getIconAndStyling = () => {
    switch (type) {
      case 'alert':
        if (!alert) return null;
        
        const alertStyling = getWeatherAlertStyling(alert);
        const IconComponent = WeatherIcons[alert.type];
        
        return {
          Icon: IconComponent,
          containerClass: cn(
            'rounded-md transition-all duration-200',
            alertStyling.containerClass,
            interactive && 'hover:scale-105 cursor-pointer',
            config.container
          ),
          iconClass: cn(config.icon, alertStyling.iconClass),
          tooltipContent: (
            <div className="space-y-2 max-w-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">
                  {alert.type} {alert.severity === 'high' ? 'Warning' : 'Alert'}
                </span>
                <Badge 
                  className={cn(
                    config.badge,
                    alert.severity === 'high' ? 'bg-chart-5 text-primary-foreground' :
                    alert.severity === 'medium' ? 'bg-chart-3 text-primary-foreground' :
                    'bg-chart-2 text-primary-foreground'
                  )}
                >
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-xs text-popover-foreground">{alert.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{alert.startTime} - {alert.endTime}</span>
              </div>
            </div>
          )
        };

      case 'condition':
        if (!forecast) return null;
        
        const conditionKey = forecast.conditions.toLowerCase();
        const ConditionIcon = WeatherIcons[conditionKey as keyof typeof WeatherIcons] || WeatherIcons.cloudy;
        
        return {
          Icon: ConditionIcon,
          containerClass: cn(
            'rounded-md bg-chart-1/10 border border-chart-1/20 transition-all duration-200',
            interactive && 'hover:bg-chart-1/20 cursor-pointer',
            config.container
          ),
          iconClass: cn(config.icon, 'text-chart-1'),
          tooltipContent: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getWeatherEmoji(forecast.conditions)}</span>
                <span className="font-medium">{forecast.conditions}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3" />
                  <span>{formatTemperature(forecast.temperature.high)} / {formatTemperature(forecast.temperature.low)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(forecast.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              {forecast.alerts.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-chart-5">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{forecast.alerts.length} active alert{forecast.alerts.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )
        };

      case 'temperature':
        if (!forecast) return null;
        
        const tempIcon = forecast.temperature.high > 85 ? WeatherIcons.heat : WeatherIcons.temperature;
        const tempColor = forecast.temperature.high > 85 ? 'text-chart-1' : 
                         forecast.temperature.high < 40 ? 'text-chart-4' : 'text-chart-2';
        
        return {
          Icon: tempIcon,
          containerClass: cn(
            'rounded-md bg-muted/50 border border-border transition-all duration-200',
            interactive && 'hover:bg-muted cursor-pointer',
            config.container
          ),
          iconClass: cn(config.icon, tempColor),
          tooltipContent: (
            <div className="space-y-1">
              <div className="font-medium">Temperature Range</div>
              <div className="text-xs">
                High: {formatTemperature(forecast.temperature.high)}<br />
                Low: {formatTemperature(forecast.temperature.low)}
              </div>
            </div>
          )
        };

      case 'summary':
        if (!forecast) return null;
        
        const hasAlerts = forecast.alerts.length > 0;
        const SummaryIcon = hasAlerts ? WeatherIcons.warning : WeatherIcons.success;
        const summaryColor = hasAlerts ? 'text-chart-5' : 'text-chart-1';
        
        return {
          Icon: SummaryIcon,
          containerClass: cn(
            'rounded-md transition-all duration-200',
            hasAlerts ? 'bg-chart-5/10 border border-chart-5/20' : 'bg-chart-1/10 border border-chart-1/20',
            interactive && 'hover:scale-105 cursor-pointer',
            config.container
          ),
          iconClass: cn(config.icon, summaryColor),
          tooltipContent: (
            <div className="space-y-2 max-w-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getWeatherEmoji(forecast.conditions)}</span>
                <span className="font-medium">Weather Summary</span>
              </div>
              <div className="text-xs space-y-1">
                <div>Conditions: {forecast.conditions}</div>
                <div>Temperature: {formatTemperature(forecast.temperature.high)} / {formatTemperature(forecast.temperature.low)}</div>
                {hasAlerts ? (
                  <div className="text-chart-5">
                    {forecast.alerts.length} active weather alert{forecast.alerts.length !== 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="text-chart-1">No weather alerts</div>
                )}
              </div>
            </div>
          )
        };

      default:
        return null;
    }
  };

  const iconData = getIconAndStyling();
  if (!iconData) return null;

  const { Icon, containerClass, iconClass, tooltipContent } = iconData;

  const iconElement = (
    <div 
      className={cn(containerClass, className)}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      <Icon className={iconClass} />
      {showBadge && alert && (
        <Badge 
          className={cn(
            'absolute -top-1 -right-1 min-w-0 h-4 px-1',
            config.badge,
            alert.severity === 'high' ? 'bg-chart-5 text-primary-foreground' :
            alert.severity === 'medium' ? 'bg-chart-3 text-primary-foreground' :
            'bg-chart-2 text-primary-foreground'
          )}
        >
          !
        </Badge>
      )}
    </div>
  );

  if (!showTooltip) {
    return iconElement;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {iconElement}
      </TooltipTrigger>
      <TooltipContent 
        className="bg-popover text-popover-foreground border-border"
        sideOffset={8}
      >
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

// Specialized weather icon components for common use cases
export const WeatherAlertIcon: React.FC<Omit<WeatherIconProps, 'type'> & { alert: WeatherAlert }> = (props) => (
  <WeatherIcon {...props} type="alert" />
);

export const WeatherConditionIcon: React.FC<Omit<WeatherIconProps, 'type'> & { forecast: WeatherForecast }> = (props) => (
  <WeatherIcon {...props} type="condition" />
);

export const WeatherTemperatureIcon: React.FC<Omit<WeatherIconProps, 'type'> & { forecast: WeatherForecast }> = (props) => (
  <WeatherIcon {...props} type="temperature" />
);

export const WeatherSummaryIcon: React.FC<Omit<WeatherIconProps, 'type'> & { forecast: WeatherForecast }> = (props) => (
  <WeatherIcon {...props} type="summary" />
);

// Weather icon grid component for displaying multiple weather conditions
interface WeatherIconGridProps {
  forecasts: WeatherForecast[];
  alerts?: WeatherAlert[];
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltips?: boolean;
  interactive?: boolean;
  onIconClick?: (forecast: WeatherForecast, alert?: WeatherAlert) => void;
}

export const WeatherIconGrid: React.FC<WeatherIconGridProps> = ({
  forecasts,
  alerts = [],
  className,
  iconSize = 'md',
  showTooltips = true,
  interactive = false,
  onIconClick
}) => {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2", className)}>
      {forecasts.map((forecast, index) => {
        const forecastAlerts = alerts.filter(alert => 
          // Assuming alerts are associated with forecasts by date
          true // In a real implementation, you'd match by date or other criteria
        );
        
        return (
          <div key={forecast.date} className="flex flex-col items-center space-y-1">
            <WeatherSummaryIcon
              forecast={forecast}
              size={iconSize}
              showTooltip={showTooltips}
              interactive={interactive}
              onClick={() => onIconClick?.(forecast)}
            />
            <div className="text-xs text-center text-muted-foreground">
              {new Date(forecast.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            {forecastAlerts.length > 0 && (
              <div className="flex gap-1">
                {forecastAlerts.slice(0, 3).map((alert, alertIndex) => (
                  <WeatherAlertIcon
                    key={alertIndex}
                    alert={alert}
                    size="sm"
                    showTooltip={showTooltips}
                    interactive={interactive}
                    onClick={() => onIconClick?.(forecast, alert)}
                  />
                ))}
                {forecastAlerts.length > 3 && (
                  <Badge className="text-xs bg-muted text-muted-foreground">
                    +{forecastAlerts.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeatherIcon;
