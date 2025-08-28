"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  Thermometer,
  CloudRain,
  Snowflake,
  Wind,
  Sun,
  RefreshCw,
  Shield,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WeatherAlert, WeatherForecast, Crew, JobTicket } from '@/types';
import { 
  assessWeatherImpact, 
  getWeatherEmoji, 
  formatTemperature,
  WEATHER_TYPE_CONFIG 
} from '@/lib/weatherUtils';
import { DispatchNotifications } from './DispatchNotifications';

interface DispatchButtonProps {
  crew?: Crew;
  jobs?: JobTicket[];
  weatherForecast?: WeatherForecast;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onDispatch?: (dispatchData: DispatchData) => Promise<void>;
  onCancel?: () => void;
  showWeatherWarnings?: boolean;
  requireConfirmation?: boolean;
}

interface DispatchData {
  crewId?: string;
  jobIds: string[];
  dispatchTime: string;
  weatherConditions?: WeatherForecast;
  weatherOverrides?: string[];
  estimatedDuration?: number;
  specialInstructions?: string;
}

const DispatchButton: React.FC<DispatchButtonProps> = ({
  crew,
  jobs = [],
  weatherForecast,
  className,
  disabled = false,
  variant = 'default',
  size = 'default',
  onDispatch,
  onCancel,
  showWeatherWarnings = true,
  requireConfirmation = true
}) => {
  const [isDispatching, setIsDispatching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Weather impact assessment
  const weatherImpact = weatherForecast 
    ? assessWeatherImpact(weatherForecast) 
    : { hasActiveAlerts: false, activeAlerts: [], impactLevel: 'none' as const, recommendations: [], shouldDispatch: true };

  // Calculate dispatch readiness
  const canDispatch = !disabled && jobs.length > 0 && (!showWeatherWarnings || weatherImpact.shouldDispatch);
  const hasWeatherWarnings = showWeatherWarnings && weatherImpact.hasActiveAlerts;
  const isHighRisk = weatherImpact.impactLevel === 'high';

  // Weather icon mapping
  const WeatherIcons = {
    rain: CloudRain,
    snow: Snowflake,
    wind: Wind,
    heat: Sun
  };

  // Handle dispatch action
  const handleDispatch = async () => {
    if (!canDispatch || isDispatching) return;

    setIsDispatching(true);
    
    try {
      const dispatchData: DispatchData = {
        crewId: crew?.id,
        jobIds: jobs.map(job => job.id),
        dispatchTime: new Date().toISOString(),
        weatherConditions: weatherForecast,
        weatherOverrides: weatherImpact.activeAlerts.map(alert => `${alert.type}-${alert.severity}`),
        estimatedDuration: jobs.reduce((total, job) => total + (job.estimatedHours * 60 || 60), 0),
        specialInstructions: weatherImpact.recommendations.join('; ')
      };

      await onDispatch?.(dispatchData);
      
      // Show success notification
      if (crew) {
        DispatchNotifications.showDispatchSuccess(crew, jobs, dispatchData);
        
        // Show weather override warning if applicable
        if (hasWeatherWarnings && weatherImpact.activeAlerts.length > 0) {
          setTimeout(() => {
            DispatchNotifications.showWeatherOverrideWarning(weatherImpact.activeAlerts, crew);
          }, 1000);
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Dispatch failed:', error);
      
      // Show error notification
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during dispatch';
      DispatchNotifications.showDispatchError(errorMessage, crew);
    } finally {
      setIsDispatching(false);
    }
  };

  // Handle simple dispatch (no confirmation dialog)
  const handleSimpleDispatch = async () => {
    if (!requireConfirmation) {
      await handleDispatch();
    } else {
      setIsDialogOpen(true);
    }
  };

  // Get button styling based on weather conditions
  const getButtonStyling = () => {
    if (disabled) {
      return 'bg-muted text-muted-foreground cursor-not-allowed';
    }
    
    if (isHighRisk) {
      return 'bg-chart-5 text-primary-foreground hover:bg-chart-5/90 border-chart-5';
    }
    
    if (hasWeatherWarnings) {
      return 'bg-chart-3 text-primary-foreground hover:bg-chart-3/90 border-chart-3';
    }
    
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  };

  // Animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    dispatching: { 
      scale: [1, 1.05, 1]
    }
  };

  const iconVariants = {
    idle: { rotate: 0 },
    dispatching: { 
      rotate: 360
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <motion.div
          variants={buttonVariants}
          initial="idle"
          whileHover={!disabled ? "hover" : "idle"}
          whileTap={!disabled ? "tap" : "idle"}
          animate={isDispatching ? "dispatching" : "idle"}
          transition={{
            duration: isDispatching ? 0.6 : 0.2,
            repeat: isDispatching ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <Button
            className={cn(
              "relative transition-all duration-200",
              getButtonStyling(),
              className
            )}
            disabled={disabled || isDispatching}
            variant={variant}
            size={size}
            onClick={handleSimpleDispatch}
          >
            <motion.div
              variants={iconVariants}
              animate={isDispatching ? "dispatching" : "idle"}
              className="flex items-center gap-2"
            >
              {isDispatching ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              
              <span>
                {isDispatching ? 'Dispatching...' : 'Dispatch Crew'}
              </span>
            </motion.div>

            {/* Weather warning indicator */}
            {hasWeatherWarnings && (
              <Badge 
                className={cn(
                  "absolute -top-2 -right-2 min-w-0 h-5 px-1.5 text-xs",
                  isHighRisk ? 'bg-chart-5 text-primary-foreground' : 'bg-chart-3 text-primary-foreground'
                )}
              >
                {weatherImpact.activeAlerts.length}
              </Badge>
            )}
          </Button>
        </motion.div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-card text-card-foreground border-border max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-md",
              isHighRisk ? 'bg-chart-5/20' : hasWeatherWarnings ? 'bg-chart-3/20' : 'bg-chart-1/20'
            )}>
              {isHighRisk ? (
                <AlertTriangle className="w-6 h-6 text-chart-5" />
              ) : hasWeatherWarnings ? (
                <Shield className="w-6 h-6 text-chart-3" />
              ) : (
                <Truck className="w-6 h-6 text-chart-1" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {isHighRisk ? 'High Risk Weather Dispatch' : 'Confirm Crew Dispatch'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {crew ? `Dispatching ${crew.name}` : 'Dispatching crew'} with {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Crew Information */}
          {crew && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-chart-1" />
                Crew Details
              </h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{crew.name}</span>
                  <Badge className="bg-chart-1 text-primary-foreground">
                    {crew.members.length} members
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Lead: {crew.members.find(m => m.role === 'lead')?.name || 'Not assigned'}
                </div>
              </div>
            </div>
          )}

          {/* Job Summary */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-chart-2" />
              Job Summary ({jobs.length} jobs)
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
              {jobs.slice(0, 5).map((job, index) => (
                <div key={job.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate">{job.clientId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {(job.estimatedHours * 60) || 60}min
                    </span>
                  </div>
                </div>
              ))}
              {jobs.length > 5 && (
                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                  +{jobs.length - 5} more jobs
                </div>
              )}
            </div>
          </div>

          {/* Weather Conditions */}
          {weatherForecast && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <span className="text-lg">{getWeatherEmoji(weatherForecast.conditions)}</span>
                Weather Conditions
              </h4>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{weatherForecast.conditions}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Thermometer className="w-4 h-4 text-chart-2" />
                    <span>
                      {formatTemperature(weatherForecast.temperature.high)} / {formatTemperature(weatherForecast.temperature.low)}
                    </span>
                  </div>
                </div>

                {/* Active Weather Alerts */}
                {weatherImpact.activeAlerts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Active Alerts:</div>
                    {weatherImpact.activeAlerts.map((alert, index) => {
                      const IconComponent = WeatherIcons[alert.type];
                      return (
                        <div 
                          key={index}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-md border",
                            alert.severity === 'high' ? 'bg-chart-5/10 border-chart-5/20' :
                            alert.severity === 'medium' ? 'bg-chart-3/10 border-chart-3/20' :
                            'bg-chart-2/10 border-chart-2/20'
                          )}
                        >
                          <IconComponent className={cn(
                            "w-4 h-4",
                            WEATHER_TYPE_CONFIG[alert.type].color
                          )} />
                          <div className="flex-1">
                            <div className="text-sm font-medium capitalize">
                              {alert.type} {alert.severity === 'high' ? 'Warning' : 'Alert'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {alert.startTime} - {alert.endTime}
                            </div>
                          </div>
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
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Weather Recommendations */}
                {weatherImpact.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Recommendations:</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {weatherImpact.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-chart-3 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {hasWeatherWarnings && (
            <div className={cn(
              "p-4 rounded-lg border",
              isHighRisk ? 'bg-chart-5/10 border-chart-5/20' : 'bg-chart-3/10 border-chart-3/20'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  isHighRisk ? 'text-chart-5' : 'text-chart-3'
                )} />
                <span className="font-medium text-sm">
                  {isHighRisk ? 'High Risk Conditions' : 'Weather Advisory'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isHighRisk 
                  ? 'Current weather conditions pose significant risks. Consider postponing non-essential work.'
                  : 'Weather conditions may affect work efficiency. Monitor conditions closely.'
                }
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDispatch}
            disabled={isDispatching || !canDispatch}
            className={cn(
              "transition-colors duration-200",
              isHighRisk ? 'bg-chart-5 text-primary-foreground hover:bg-chart-5/90' :
              hasWeatherWarnings ? 'bg-chart-3 text-primary-foreground hover:bg-chart-3/90' :
              'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {isDispatching ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Dispatching...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {isHighRisk ? 'Dispatch Anyway' : 'Confirm Dispatch'}
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DispatchButton;
