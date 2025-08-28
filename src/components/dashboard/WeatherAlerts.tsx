"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CloudRain, 
  Snowflake, 
  Wind, 
  Sun, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WeatherAlert, WeatherForecast } from '@/types';
import { 
  mockWeatherAPI, 
  assessWeatherImpact, 
  getWeatherAlertStyling, 
  getWeatherEmoji, 
  formatTemperature,
  sortWeatherAlertsByPriority,
  WEATHER_TYPE_CONFIG
} from '@/lib/weatherUtils';

interface WeatherAlertsProps {
  className?: string;
  selectedDate?: string;
  onWeatherImpact?: (impact: ReturnType<typeof assessWeatherImpact>) => void;
  showOverride?: boolean;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({
  className,
  selectedDate = new Date().toISOString().split('T')[0],
  onWeatherImpact,
  showOverride = true
}) => {
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toTimeString().slice(0, 5));
  const [overriddenAlerts, setOverriddenAlerts] = useState<Set<string>>(new Set());
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Weather icon mapping
  const WeatherIcons = {
    CloudRain,
    Snowflake, 
    Wind,
    Sun
  };

  // Fetch weather data when date changes
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const forecast = await mockWeatherAPI(selectedDate);
        setWeatherData(forecast);
        
        // Assess impact and notify parent
        if (onWeatherImpact) {
          const impact = assessWeatherImpact(forecast, currentTime);
          onWeatherImpact(impact);
        }
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather API error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [selectedDate, currentTime, onWeatherImpact]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle alert override
  const handleOverrideAlert = (alertIndex: number) => {
    const alertKey = `${selectedDate}-${alertIndex}`;
    setOverriddenAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertKey)) {
        newSet.delete(alertKey);
      } else {
        newSet.add(alertKey);
      }
      return newSet;
    });
  };

  // Filter and sort alerts
  const processedAlerts = weatherData?.alerts 
    ? sortWeatherAlertsByPriority(weatherData.alerts).map((alert, index) => ({
        ...alert,
        index,
        isOverridden: overriddenAlerts.has(`${selectedDate}-${index}`),
        isActive: isAlertActive(alert, currentTime)
      }))
    : [];

  const activeAlerts = processedAlerts.filter(alert => alert.isActive && !alert.isOverridden);
  const displayAlerts = showAllAlerts ? processedAlerts : activeAlerts;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const alertVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("bg-card text-card-foreground border-border", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-chart-1 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-card text-card-foreground border-border", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertTriangle className="w-8 h-8 text-chart-5" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground mb-1">Weather Data Unavailable</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-4", className)}
    >
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">{getWeatherEmoji(weatherData?.conditions || '')}</span>
                Weather Alerts
                {activeAlerts.length > 0 && (
                  <Badge className="bg-chart-5 text-primary-foreground">
                    {activeAlerts.length} Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                <span className="text-muted-foreground">•</span>
                <span>{weatherData?.conditions}</span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {processedAlerts.length > activeAlerts.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllAlerts(!showAllAlerts)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showAllAlerts ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Active Only
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show All
                    </>
                  )}
                </Button>
              )}
              
              {weatherData && (
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {formatTemperature(weatherData.temperature.high)} / {formatTemperature(weatherData.temperature.low)}
                  </p>
                  <p className="text-xs text-muted-foreground">High / Low</p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* No Alerts State */}
          {displayAlerts.length === 0 && (
            <div className="flex items-center justify-center p-8 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-chart-1 mx-auto" />
                <p className="text-sm font-medium text-chart-1">
                  {activeAlerts.length === 0 ? 'No Active Weather Alerts' : 'All Alerts Overridden'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Conditions are favorable for outdoor work
                </p>
              </div>
            </div>
          )}

          {/* Weather Alerts */}
          <AnimatePresence mode="popLayout">
            {displayAlerts.map((alert) => {
              const styling = getWeatherAlertStyling(alert);
              const IconComponent = WeatherIcons[WEATHER_TYPE_CONFIG[alert.type].icon as keyof typeof WeatherIcons];
              
              return (
                <motion.div
                  key={`${alert.type}-${alert.index}`}
                  variants={alertVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={cn(
                    "p-4 rounded-lg transition-all duration-200",
                    styling.containerClass,
                    alert.isOverridden && "opacity-60",
                    !alert.isActive && "border-dashed"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        "p-2 rounded-md",
                        alert.severity === 'high' ? 'bg-chart-5/20' :
                        alert.severity === 'medium' ? 'bg-chart-3/20' : 'bg-chart-2/20'
                      )}>
                        <IconComponent className={cn("w-5 h-5", styling.iconClass)} />
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground capitalize">
                            {alert.type} {alert.severity === 'high' ? 'Warning' : 'Alert'}
                          </h4>
                          <Badge 
                            className={cn(
                              "text-xs",
                              alert.severity === 'high' ? 'bg-chart-5 text-primary-foreground' :
                              alert.severity === 'medium' ? 'bg-chart-3 text-primary-foreground' :
                              'bg-chart-2 text-primary-foreground'
                            )}
                          >
                            {alert.severity}
                          </Badge>
                          {alert.isActive && (
                            <Badge className="bg-chart-1 text-primary-foreground">
                              Active
                            </Badge>
                          )}
                          {alert.isOverridden && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Overridden
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-foreground">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{alert.startTime} - {alert.endTime}</span>
                          </div>
                          {!alert.isActive && (
                            <span className="text-chart-4">
                              {isTimeInFuture(alert.startTime, currentTime) ? 'Upcoming' : 'Past'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Override Controls */}
                    {showOverride && (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOverrideAlert(alert.index)}
                          className={cn(
                            "h-8 px-3 text-xs transition-colors duration-200",
                            alert.isOverridden 
                              ? "bg-chart-1/10 text-chart-1 hover:bg-chart-1/20" 
                              : "hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {alert.isOverridden ? 'Restore' : 'Override'}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Summary Stats */}
          {weatherData && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-chart-1">{processedAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-chart-3">{activeAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-chart-4">{overriddenAlerts.size}</p>
                <p className="text-xs text-muted-foreground">Overridden</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper functions
function isAlertActive(alert: WeatherAlert, currentTime: string): boolean {
  const currentMinutes = timeToMinutes(currentTime);
  const startMinutes = timeToMinutes(alert.startTime);
  const endMinutes = timeToMinutes(alert.endTime);
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

function isTimeInFuture(alertTime: string, currentTime: string): boolean {
  return timeToMinutes(alertTime) > timeToMinutes(currentTime);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export default WeatherAlerts;
