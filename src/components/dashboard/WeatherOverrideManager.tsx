"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Settings,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Lock,
  Unlock,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WeatherAlert, WeatherForecast } from '@/types';
import { 
  assessWeatherImpact, 
  getWeatherAlertStyling,
  WEATHER_TYPE_CONFIG 
} from '@/lib/weatherUtils';
import { WeatherAlertIcon } from './WeatherIcon';
import { DispatchNotifications } from './DispatchNotifications';

interface WeatherOverride {
  id: string;
  alertType: WeatherAlert['type'];
  alertSeverity: WeatherAlert['severity'];
  overrideReason: string;
  authorizedBy: string;
  timestamp: string;
  expiresAt?: string;
  isActive: boolean;
  conditions?: string;
}

interface WeatherOverrideManagerProps {
  weatherForecast?: WeatherForecast;
  onOverrideChange?: (overrides: WeatherOverride[]) => void;
  className?: string;
  allowOverrides?: boolean;
  requireAuthorization?: boolean;
  maxOverrideDuration?: number; // in hours
}

const WeatherOverrideManager: React.FC<WeatherOverrideManagerProps> = ({
  weatherForecast,
  onOverrideChange,
  className,
  allowOverrides = true,
  requireAuthorization = true,
  maxOverrideDuration = 24
}) => {
  const [overrides, setOverrides] = useState<WeatherOverride[]>([]);
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('');
  const [overrideDuration, setOverrideDuration] = useState(4); // hours
  const [showHistory, setShowHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Weather impact assessment
  const weatherImpact = weatherForecast 
    ? assessWeatherImpact(weatherForecast) 
    : { hasActiveAlerts: false, activeAlerts: [], impactLevel: 'none' as const, recommendations: [], shouldDispatch: true };

  // Filter active overrides
  const activeOverrides = overrides.filter(override => {
    if (!override.isActive) return false;
    if (override.expiresAt && new Date(override.expiresAt) < new Date()) {
      // Auto-expire overrides
      handleExpireOverride(override.id);
      return false;
    }
    return true;
  });

  // Check if alert is overridden
  const isAlertOverridden = (alert: WeatherAlert): boolean => {
    return activeOverrides.some(override => 
      override.alertType === alert.type && 
      override.alertSeverity === alert.severity
    );
  };

  // Handle creating new override
  const handleCreateOverride = async () => {
    if (!selectedAlert || !overrideReason.trim() || (requireAuthorization && !authorizedBy.trim())) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newOverride: WeatherOverride = {
        id: `override-${Date.now()}`,
        alertType: selectedAlert.type,
        alertSeverity: selectedAlert.severity,
        overrideReason: overrideReason.trim(),
        authorizedBy: authorizedBy.trim(),
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + overrideDuration * 60 * 60 * 1000).toISOString(),
        isActive: true,
        conditions: `${selectedAlert.type} ${selectedAlert.severity} from ${selectedAlert.startTime} to ${selectedAlert.endTime}`
      };

      const updatedOverrides = [...overrides, newOverride];
      setOverrides(updatedOverrides);
      onOverrideChange?.(updatedOverrides);

      // Show success notification
      DispatchNotifications.showWeatherOverrideWarning([selectedAlert], { 
        id: 'override-crew', 
        name: 'Override Manager', 
        specialization: 'Weather Management',
        members: [] 
      });

      // Reset form
      setSelectedAlert(null);
      setOverrideReason('');
      setAuthorizedBy('');
      setIsOverrideMode(false);
    } catch (error) {
      console.error('Failed to create override:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle removing override
  const handleRemoveOverride = (overrideId: string) => {
    const updatedOverrides = overrides.map(override => 
      override.id === overrideId 
        ? { ...override, isActive: false }
        : override
    );
    setOverrides(updatedOverrides);
    onOverrideChange?.(updatedOverrides);
  };

  // Handle expiring override
  const handleExpireOverride = (overrideId: string) => {
    const updatedOverrides = overrides.map(override => 
      override.id === overrideId 
        ? { ...override, isActive: false }
        : override
    );
    setOverrides(updatedOverrides);
    onOverrideChange?.(updatedOverrides);
  };

  // Auto-cleanup expired overrides
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hasExpired = overrides.some(override => 
        override.isActive && 
        override.expiresAt && 
        new Date(override.expiresAt) < now
      );
      
      if (hasExpired) {
        const updatedOverrides = overrides.map(override => ({
          ...override,
          isActive: override.expiresAt && new Date(override.expiresAt) > now ? override.isActive : false
        }));
        setOverrides(updatedOverrides);
        onOverrideChange?.(updatedOverrides);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [overrides, onOverrideChange]);

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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  if (!allowOverrides) {
    return (
      <Card className={cn("bg-card text-card-foreground border-border", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Weather overrides are disabled</span>
          </div>
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
                <Shield className="w-5 h-5 text-chart-3" />
                Weather Override Manager
                {activeOverrides.length > 0 && (
                  <Badge className="bg-chart-3 text-primary-foreground">
                    {activeOverrides.length} Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage weather alert overrides for dispatch operations
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showHistory ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide History
                  </>
                ) : (
                  <>
                    <History className="w-4 h-4 mr-2" />
                    Show History
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Switch
                  checked={isOverrideMode}
                  onCheckedChange={setIsOverrideMode}
                  disabled={!weatherImpact.hasActiveAlerts}
                />
                <Label className="text-sm">Override Mode</Label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Weather Alerts */}
          {weatherImpact.hasActiveAlerts && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Active Weather Alerts</h4>
              <div className="space-y-2">
                {weatherImpact.activeAlerts.map((alert, index) => {
                  const isOverridden = isAlertOverridden(alert);
                  const styling = getWeatherAlertStyling(alert);
                  
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={cn(
                        "p-3 rounded-lg border transition-all duration-200",
                        styling.containerClass,
                        isOverridden && "opacity-60 border-dashed",
                        isOverrideMode && !isOverridden && "hover:bg-accent/50 cursor-pointer"
                      )}
                      onClick={() => {
                        if (isOverrideMode && !isOverridden) {
                          setSelectedAlert(alert);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <WeatherAlertIcon
                            alert={alert}
                            size="sm"
                            showTooltip={false}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize text-sm">
                                {alert.type} {alert.severity === 'high' ? 'Warning' : 'Alert'}
                              </span>
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
                            <div className="text-xs text-muted-foreground">
                              {alert.startTime} - {alert.endTime}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isOverridden ? (
                            <Badge variant="outline" className="text-chart-1 border-chart-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Overridden
                            </Badge>
                          ) : isOverrideMode ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              Click to Override
                            </Badge>
                          ) : (
                            <Badge 
                              className={cn(
                                "text-xs",
                                alert.severity === 'high' ? 'bg-chart-5/20 text-chart-5' :
                                alert.severity === 'medium' ? 'bg-chart-3/20 text-chart-3' :
                                'bg-chart-2/20 text-chart-2'
                              )}
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Override Form */}
          <AnimatePresence>
            {isOverrideMode && selectedAlert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-chart-3" />
                  <h4 className="font-medium">Create Weather Override</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="override-reason">Override Reason *</Label>
                    <Textarea
                      id="override-reason"
                      placeholder="Explain why this weather alert should be overridden..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="bg-background border-border"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    {requireAuthorization && (
                      <div className="space-y-2">
                        <Label htmlFor="authorized-by">Authorized By *</Label>
                        <Input
                          id="authorized-by"
                          placeholder="Supervisor name or ID"
                          value={authorizedBy}
                          onChange={(e) => setAuthorizedBy(e.target.value)}
                          className="bg-background border-border"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="override-duration">Duration (hours)</Label>
                      <Input
                        id="override-duration"
                        type="number"
                        min="1"
                        max={maxOverrideDuration}
                        value={overrideDuration}
                        onChange={(e) => setOverrideDuration(Number(e.target.value))}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAlert(null);
                      setOverrideReason('');
                      setAuthorizedBy('');
                    }}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>

                  <Button
                    onClick={handleCreateOverride}
                    disabled={
                      isSubmitting || 
                      !overrideReason.trim() || 
                      (requireAuthorization && !authorizedBy.trim())
                    }
                    className="bg-chart-3 text-primary-foreground hover:bg-chart-3/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Settings className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Override
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Overrides */}
          {activeOverrides.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Active Overrides</h4>
              <div className="space-y-2">
                {activeOverrides.map((override) => (
                  <motion.div
                    key={override.id}
                    variants={itemVariants}
                    className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-chart-1 text-primary-foreground text-xs">
                            {override.alertType} {override.alertSeverity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {override.authorizedBy}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground">{override.overrideReason}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(override.timestamp).toLocaleString()}</span>
                          </div>
                          {override.expiresAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Expires: {new Date(override.expiresAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOverride(override.id)}
                        className="text-chart-5 hover:text-chart-5 hover:bg-chart-5/10"
                      >
                        <Unlock className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Override History */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <h4 className="font-medium text-foreground">Override History</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {overrides.filter(o => !o.isActive).map((override) => (
                    <div
                      key={override.id}
                      className="p-3 rounded-lg bg-muted/30 border border-border opacity-75"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {override.alertType} {override.alertSeverity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              by {override.authorizedBy}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{override.overrideReason}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Expired
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {overrides.filter(o => !o.isActive).length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      No override history
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Alerts State */}
          {!weatherImpact.hasActiveAlerts && (
            <div className="flex items-center justify-center p-8 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-chart-1 mx-auto" />
                <p className="text-sm font-medium text-chart-1">No Active Weather Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Weather conditions are favorable for operations
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherOverrideManager;
