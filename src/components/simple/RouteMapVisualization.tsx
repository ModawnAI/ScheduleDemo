"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Clock, Fuel, X, Play, Pause, CheckCircle } from 'lucide-react';
import { JobTicket, Crew, RouteMetrics } from '@/types';

interface RouteMapVisualizationProps {
  crew: Crew;
  jobs: JobTicket[];
  metrics: RouteMetrics;
  routeOptimizations: string[];
  onClose: () => void;
}

const RouteMapVisualization: React.FC<RouteMapVisualizationProps> = ({
  crew,
  jobs,
  metrics,
  routeOptimizations,
  onClose
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Check if mapboxgl is available
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).mapboxgl) {
      const mapboxgl = (window as unknown as Record<string, unknown>).mapboxgl as typeof import('mapbox-gl');
             mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiYnVya2hhcmQxOTg5IiwiYSI6ImNtZXV6MDd6ZzA0djUycXIxZzM5aDlybTkifQ.4B9wcxhuG9kdzC3VewruVQ';

      if (jobs.length > 0) {
        // Calculate center point from all job locations
        const centerLat = jobs.reduce((sum, job) => sum + job.lat, 0) / jobs.length;
        const centerLng = jobs.reduce((sum, job) => sum + job.long, 0) / jobs.length;

        const newMap = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [centerLng, centerLat],
          zoom: 11
        });

        newMap.on('load', () => {
          // Add job markers
          jobs.forEach((job, index) => {
            const el = document.createElement('div');
            el.className = 'route-marker';
            el.innerHTML = `
              <div style="
                background: ${index === 0 ? '#10b981' : index === jobs.length - 1 ? '#ef4444' : '#3b82f6'};
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                ${index + 1}
              </div>
            `;

            new mapboxgl.Marker(el)
              .setLngLat([job.long, job.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div style="padding: 8px;">
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
          });

          // Add route line
          const routeCoordinates = jobs.map(job => [job.long, job.lat]);
          
          newMap.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          });

          newMap.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          // Add animated point for route simulation
          newMap.addSource('animated-point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: routeCoordinates[0]
                }
              }]
            }
          });

          newMap.addLayer({
            id: 'animated-point',
            type: 'circle',
            source: 'animated-point',
            paint: {
              'circle-radius': 8,
              'circle-color': '#fbbf24',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }
          });

          // Fit map to show all markers
          const bounds = new mapboxgl.LngLatBounds();
          jobs.forEach(job => bounds.extend([job.long, job.lat]));
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
  }, [jobs, map]);

  const animateRoute = () => {
    if (!map || jobs.length < 2) return;

    setIsAnimating(true);
    let currentIndex = 0;
    const totalSteps = jobs.length - 1;
    const animationDuration = 3000; // 3 seconds total
    const stepDuration = animationDuration / totalSteps;

    const animate = () => {
      if (currentIndex >= jobs.length - 1) {
        setIsAnimating(false);
        setCurrentJobIndex(0);
        return;
      }

      const nextJob = jobs[currentIndex + 1];
      
      // Update animated point position
      const source = map.getSource('animated-point') as mapboxgl.GeoJSONSource;
      if (source && source.setData) {
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [nextJob.long, nextJob.lat]
            }
          }]
        });
      }

      setCurrentJobIndex(currentIndex + 1);
      currentIndex++;

      if (currentIndex < jobs.length - 1) {
        setTimeout(animate, stepDuration);
      } else {
        setIsAnimating(false);
        setCurrentJobIndex(0);
      }
    };

    animate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base truncate">{crew.name} - Optimized Route</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{crew.specialization}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="self-start sm:self-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-[500px] sm:h-[600px]">
          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Fallback when map doesn't load */}
            {!map && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-foreground">Route Map</h3>
                    <p className="text-sm text-muted-foreground">
                      {jobs.length} stops • {metrics.totalDistance?.toFixed(1)} miles
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Map visualization loading...
                    </p>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    {jobs.slice(0, 3).map((job, index) => (
                      <div key={job.id} className="flex items-center space-x-2 text-xs">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                          index === 0 ? 'bg-green-500' : index === jobs.length - 1 ? 'bg-red-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="truncate">{job.clientId}</span>
                      </div>
                    ))}
                    {jobs.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{jobs.length - 3} more stops...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Controls */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 space-y-2">
              <Button
                size="sm"
                onClick={animateRoute}
                disabled={isAnimating || jobs.length < 2}
                className="bg-white/90 text-foreground hover:bg-white text-xs sm:text-sm"
              >
                {isAnimating ? (
                  <>
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Animating...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Simulate Route</span>
                    <span className="sm:hidden">Play</span>
                  </>
                )}
              </Button>
            </div>

            {/* Current Job Indicator */}
            {isAnimating && currentJobIndex < jobs.length && (
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-sm">En route to:</p>
                    <p className="text-xs text-muted-foreground">
                      {jobs[currentJobIndex]?.clientId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Route Details Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-muted/30 overflow-y-auto max-h-[300px] lg:max-h-none">
            <div className="p-4 space-y-4">
              {/* Route Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Route Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>Distance</span>
                    </span>
                    <span className="font-medium">{metrics.totalDistance?.toFixed(1)} mi</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Drive Time</span>
                    </span>
                    <span className="font-medium">{metrics.driveTime} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Fuel className="h-3 w-3" />
                      <span>Fuel Cost</span>
                    </span>
                    <span className="font-medium">${metrics.fuelCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Work Hours</span>
                    <span className="font-medium">{metrics.billableHours}h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Route Optimizations */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Optimizations Applied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {routeOptimizations.map((optimization, index) => (
                      <div key={index} className="flex items-start space-x-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{optimization}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Job Sequence */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Job Sequence ({jobs.length} stops)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {jobs.map((job, index) => (
                      <div 
                        key={job.id} 
                        className={`flex items-center space-x-2 p-2 rounded text-xs ${
                          isAnimating && index === currentJobIndex 
                            ? 'bg-yellow-100 border border-yellow-300' 
                            : 'bg-background'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          index === 0 ? 'bg-green-500' : 
                          index === jobs.length - 1 ? 'bg-red-500' : 
                          'bg-blue-500'
                        }`}>
                          {index + 1}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMapVisualization;
