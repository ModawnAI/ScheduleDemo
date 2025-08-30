"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Fuel, X } from 'lucide-react';
import { JobTicket, Crew, RouteMetrics } from '@/types';

interface CrewSchedule {
  crew: Crew;
  jobs: JobTicket[];
  metrics: RouteMetrics;
  optimizationScore: number;
  routeOptimizations: string[];
}

interface AllRoutesMapVisualizationProps {
  crewSchedules: CrewSchedule[];
  onClose: () => void;
}

const AllRoutesMapVisualization: React.FC<AllRoutesMapVisualizationProps> = ({
  crewSchedules,
  onClose
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<number | null>(null);

  const crewColors = useMemo(() => [
    '#10b981', // green
    '#3b82f6', // blue  
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
  ], []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Check if mapboxgl is available
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).mapboxgl) {
      const mapboxgl = (window as unknown as Record<string, unknown>).mapboxgl as typeof import('mapbox-gl');
             mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiYnVya2hhcmQxOTg5IiwiYSI6ImNtZXV6MDd6ZzA0djUycXIxZzM5aDlybTkifQ.4B9wcxhuG9kdzC3VewruVQ';

      // Calculate center point from all job locations
      const allJobs = crewSchedules.flatMap(schedule => schedule.jobs);
      if (allJobs.length > 0) {
        const centerLat = allJobs.reduce((sum, job) => sum + job.lat, 0) / allJobs.length;
        const centerLng = allJobs.reduce((sum, job) => sum + job.long, 0) / allJobs.length;

        const newMap = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [centerLng, centerLat],
          zoom: 10
        });

        newMap.on('load', () => {
          // Add routes and markers for each crew
          crewSchedules.forEach((schedule, crewIndex) => {
            const crewColor = crewColors[crewIndex % crewColors.length];
            
            // Add job markers for this crew
            schedule.jobs.forEach((job, jobIndex) => {
              const el = document.createElement('div');
              el.className = 'route-marker';
              el.innerHTML = `
                <div style="
                  background: ${crewColor};
                  color: white;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 10px;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  opacity: ${selectedCrew === null || selectedCrew === crewIndex ? '1' : '0.3'};
                  transition: opacity 0.3s ease;
                ">
                  ${jobIndex + 1}
                </div>
              `;

              const marker = new mapboxgl.Marker(el)
                .setLngLat([job.long, job.lat])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                      <div style="padding: 8px;">
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                          <div style="width: 12px; height: 12px; background: ${crewColor}; border-radius: 50%; margin-right: 6px;"></div>
                          <strong>${schedule.crew.name}</strong>
                        </div>
                        <h4 style="margin: 0 0 4px 0; font-weight: bold;">${job.clientId}</h4>
                        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${job.address}</p>
                        <p style="margin: 0; font-size: 12px;">${job.task}</p>
                        <div style="margin-top: 4px; font-size: 11px; color: #888;">
                          ${job.estimatedHours}h • Priority: ${job.priority}
                        </div>
                      </div>
                    `)
                )
                .addTo(newMap);

              // Store crew index on marker for filtering
              (marker as mapboxgl.Marker & { crewIndex: number }).crewIndex = crewIndex;
            });

            // Add route line for this crew
            const routeCoordinates = schedule.jobs.map(job => [job.long, job.lat]);
            
            newMap.addSource(`route-${crewIndex}`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: { crewIndex },
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoordinates
                }
              }
            });

            newMap.addLayer({
              id: `route-${crewIndex}`,
              type: 'line',
              source: `route-${crewIndex}`,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': crewColor,
                'line-width': 3,
                'line-opacity': selectedCrew === null || selectedCrew === crewIndex ? 0.8 : 0.3
              }
            });
          });

          // Fit map to show all markers
          const bounds = new mapboxgl.LngLatBounds();
          allJobs.forEach(job => bounds.extend([job.long, job.lat]));
          newMap.fitBounds(bounds, { padding: 50 });
        });

        setMap(newMap);
      }
    } else {
      // Fallback when Mapbox is not available
      console.warn('Mapbox GL JS not loaded. Map will show a placeholder.');
    }

    return () => {
      if (map && typeof (map as mapboxgl.Map).remove === 'function') {
        (map as mapboxgl.Map).remove();
      }
    };
  }, [crewSchedules, map]);

  // Update map opacity when crew selection changes
  useEffect(() => {
    if (!map) return;

    crewSchedules.forEach((_, crewIndex) => {
      const layer = map.getLayer(`route-${crewIndex}`);
      if (layer) {
        map.setPaintProperty(
          `route-${crewIndex}`, 
          'line-opacity', 
          selectedCrew === null || selectedCrew === crewIndex ? 0.8 : 0.3
        );
      }
    });

    // Update marker opacity
    const markers = document.querySelectorAll('.route-marker > div');
    markers.forEach((marker, index) => {
      const crewIndex = Math.floor(index / 4); // Assuming max 4 jobs per crew for demo
      (marker as HTMLElement).style.opacity = 
        selectedCrew === null || selectedCrew === crewIndex ? '1' : '0.3';
    });
  }, [selectedCrew, map, crewSchedules, crewColors]);

  const totalMetrics = crewSchedules.reduce((acc, schedule) => ({
    totalDistance: acc.totalDistance + (schedule.metrics.totalDistance || 0),
    totalDriveTime: acc.totalDriveTime + schedule.metrics.driveTime,
    totalFuelCost: acc.totalFuelCost + (schedule.metrics.fuelCost || 0),
    totalBillableHours: acc.totalBillableHours + schedule.metrics.billableHours,
    totalJobs: acc.totalJobs + schedule.jobs.length
  }), {
    totalDistance: 0,
    totalDriveTime: 0,
    totalFuelCost: 0,
    totalBillableHours: 0,
    totalJobs: 0
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base truncate">All Crew Routes - Optimized Schedule</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {crewSchedules.length} crews • {totalMetrics.totalJobs} total jobs
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="self-start sm:self-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-[500px] sm:h-[700px]">
          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Fallback when map doesn't load */}
            {!map && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-foreground">All Routes Map</h3>
                    <p className="text-sm text-muted-foreground">
                      {crewSchedules.length} crews • {crewSchedules.reduce((sum, cs) => sum + cs.jobs.length, 0)} total stops
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Map visualization loading...
                    </p>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    {crewSchedules.slice(0, 3).map((schedule, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: crewColors[index % crewColors.length] }}
                        />
                        <span className="truncate">{schedule.crew.name}</span>
                        <span className="text-muted-foreground">({schedule.jobs.length} stops)</span>
                      </div>
                    ))}
                    {crewSchedules.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{crewSchedules.length - 3} more crews...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Legend */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 p-2 sm:p-3 rounded-lg shadow-lg max-w-[200px] sm:max-w-xs">
              <h4 className="font-semibold text-xs sm:text-sm mb-2">Crew Routes</h4>
              <div className="space-y-1">
                {crewSchedules.map((schedule, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 text-xs cursor-pointer p-1 rounded ${
                      selectedCrew === index ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedCrew(selectedCrew === index ? null : index)}
                  >
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white flex-shrink-0"
                      style={{ backgroundColor: crewColors[index % crewColors.length] }}
                    ></div>
                    <span className={`truncate text-xs ${selectedCrew === null || selectedCrew === index ? 'font-medium' : 'opacity-60'}`}>
                      {schedule.crew.name} ({schedule.jobs.length})
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                <span className="hidden sm:inline">Click crew names to highlight routes</span>
                <span className="sm:hidden">Tap to highlight</span>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-muted/30 overflow-y-auto max-h-[300px] lg:max-h-none">
            <div className="p-4 space-y-4">
              {/* Overall Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overall Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>Total Distance</span>
                    </span>
                    <span className="font-medium">{totalMetrics.totalDistance.toFixed(1)} mi</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Total Drive Time</span>
                    </span>
                    <span className="font-medium">{totalMetrics.totalDriveTime} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Fuel className="h-3 w-3" />
                      <span>Total Fuel Cost</span>
                    </span>
                    <span className="font-medium">${totalMetrics.totalFuelCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Work Hours</span>
                    <span className="font-medium">{totalMetrics.totalBillableHours}h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Crew Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Crew Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crewSchedules.map((schedule, index) => (
                      <div 
                        key={index}
                        className={`p-2 rounded border cursor-pointer transition-all ${
                          selectedCrew === index 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedCrew(selectedCrew === index ? null : index)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: crewColors[index % crewColors.length] }}
                            ></div>
                            <span className="font-medium text-sm">{schedule.crew.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {schedule.optimizationScore}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {schedule.jobs.length} jobs • {schedule.metrics.totalDistance?.toFixed(1)} mi • {schedule.metrics.driveTime} min
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {schedule.crew.specialization}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Crew Details */}
              {selectedCrew !== null && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: crewColors[selectedCrew % crewColors.length] }}
                      ></div>
                      <span>{crewSchedules[selectedCrew].crew.name} Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {crewSchedules[selectedCrew].jobs.map((job, jobIndex) => (
                        <div key={job.id} className="flex items-center space-x-2 p-2 bg-background rounded text-xs">
                          <div 
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: crewColors[selectedCrew % crewColors.length] }}
                          >
                            {jobIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{job.clientId}</p>
                            <p className="text-muted-foreground truncate">{job.task}</p>
                          </div>
                          <Badge variant={job.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {job.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRoutesMapVisualization;
