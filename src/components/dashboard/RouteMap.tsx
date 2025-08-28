"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, Source, Layer, MapRef } from 'react-map-gl';
import { MapPin, Navigation, Clock, Users, Route, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockCrews, getJobsByDate } from '@/data/mockData';
import { JobTicket, RouteMetrics } from '@/types';
import { 
  calculateRouteMetrics, 
  calculateHaversineDistance, 
  debounce 
} from '@/lib/routeUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteMapProps {
  className?: string;
  selectedDate?: string;
  selectedCrew?: string;
  onJobsReorder?: (jobs: JobTicket[]) => void;
  isOptimizing?: boolean;
}

interface MarkerData extends JobTicket {
  crewColor: string;
  crewName: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  className, 
  selectedDate = "2024-09-16",
  selectedCrew,
  onJobsReorder,
  isOptimizing = false
}) => {
  const mapRef = useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [routeMetrics, setRouteMetrics] = useState<RouteMetrics | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -118.2737,
    latitude: 34.0928,
    zoom: 11
  });

  // Get jobs for the selected date
  const todaysJobs = getJobsByDate(selectedDate);
  
  // Assign crew colors using chart color variables
  const crewColors = [
    'hsl(var(--chart-1))', // Alpha Team
    'hsl(var(--chart-2))', // Bravo Team  
    'hsl(var(--chart-3))', // Charlie Team
    'hsl(var(--chart-4))', // Delta Team
    'hsl(var(--chart-5))', // Additional crews
  ];

  // Filter jobs by selected crew if specified
  const filteredJobs = selectedCrew 
    ? todaysJobs.filter((_, index) => mockCrews[index % mockCrews.length].id === selectedCrew)
    : todaysJobs;

  // Create markers with crew assignments
  const markers: MarkerData[] = filteredJobs.map((job, index) => {
    const crewIndex = index % mockCrews.length;
    const crew = mockCrews[crewIndex];
    return {
      ...job,
      crewColor: crewColors[crewIndex],
      crewName: crew.name
    };
  });

  // Route calculation function
  const calculateRoute = useCallback((jobs: JobTicket[]) => {
    if (jobs.length === 0) {
      setRouteMetrics(null);
      return;
    }
    
    setIsCalculatingRoute(true);
    
    // Simulate calculation delay for visual feedback
    setTimeout(() => {
      const metrics = calculateRouteMetrics(jobs);
      setRouteMetrics(metrics);
      setIsCalculatingRoute(false);
    }, 300);
  }, []);

  const debouncedCalculateRoute = calculateRoute;

  // Calculate route metrics when jobs change
  useEffect(() => {
    debouncedCalculateRoute(filteredJobs);
  }, [filteredJobs, debouncedCalculateRoute]);

  // Create route polylines data with enhanced chart color system
  const routeData = {
    type: 'FeatureCollection' as const,
    features: markers.length > 1 ? markers.slice(0, -1).map((marker, index) => {
      const nextMarker = markers[index + 1];
      const distance = calculateHaversineDistance(
        marker.lat, marker.long,
        nextMarker.lat, nextMarker.long
      );
      
      // Determine line color based on distance and crew
      const lineColor = marker.crewColor;
      let lineWidth = 3;
      let lineOpacity = 0.8;
      
      // Adjust styling based on distance (longer routes get different styling)
      if (distance > 10) {
        lineWidth = 4;
        lineOpacity = 0.9;
      } else if (distance < 2) {
        lineWidth = 2;
        lineOpacity = 0.6;
      }
      
      return {
        type: 'Feature' as const,
        properties: {
          crewName: marker.crewName,
          color: lineColor,
          distance: distance,
          width: lineWidth,
          opacity: lineOpacity,
          segmentIndex: index
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [[marker.long, marker.lat], [nextMarker.long, nextMarker.lat]]
        }
      };
    }) : []
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const markerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2, delay: 0.1 }
    },
    hover: {
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full h-full bg-card text-card-foreground border border-border rounded-lg overflow-hidden relative",
        className
      )}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        attributionControl={false}
      >
        {/* Route polylines with dynamic styling */}
        <Source id="routes" type="geojson" data={routeData}>
          <Layer
            id="route-lines"
            type="line"
            paint={{
              'line-color': ['get', 'color'],
              'line-width': ['get', 'width'],
              'line-opacity': ['get', 'opacity']
            }}
          />
          {/* Route line glow effect for better visibility */}
          <Layer
            id="route-lines-glow"
            type="line"
            paint={{
              'line-color': ['get', 'color'],
              'line-width': ['+', ['get', 'width'], 2],
              'line-opacity': ['*', ['get', 'opacity'], 0.3],
              'line-blur': 2
            }}
          />
        </Source>

        {/* Job location markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            longitude={marker.long}
            latitude={marker.lat}
            anchor="bottom"
          >
            <motion.div
              variants={markerVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="cursor-pointer"
              onClick={() => setSelectedMarker(marker)}
            >
              <div 
                className="relative p-2 bg-card border-2 border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                style={{ borderColor: marker.crewColor }}
              >
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: marker.crewColor }}
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          </Marker>
        ))}

        {/* Popup tooltip */}
        {selectedMarker && (
          <Popup
            longitude={selectedMarker.long}
            latitude={selectedMarker.lat}
            anchor="top"
            onClose={() => setSelectedMarker(null)}
            closeButton={false}
            className="max-w-sm"
          >
            <div className="bg-popover text-popover-foreground border border-border rounded-lg p-4 shadow-lg">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-md"
                    style={{ backgroundColor: `${selectedMarker.crewColor}20` }}
                  >
                    <MapPin 
                      className="w-4 h-4" 
                      style={{ color: selectedMarker.crewColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-popover-foreground">
                      {selectedMarker.task}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedMarker.address}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Crew:</span>
                    <span 
                      className="font-medium"
                      style={{ color: selectedMarker.crewColor }}
                    >
                      {selectedMarker.crewName}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Est. Time:</span>
                    <span className="text-popover-foreground font-medium">
                      {selectedMarker.estimatedHours}h
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Navigation className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Priority:</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      selectedMarker.priority === 'high' && "bg-destructive/10 text-destructive",
                      selectedMarker.priority === 'medium' && "bg-chart-3/10 text-chart-3",
                      selectedMarker.priority === 'low' && "bg-muted text-muted-foreground"
                    )}>
                      {selectedMarker.priority}
                    </span>
                  </div>
                </div>

                {/* Equipment */}
                {selectedMarker.requiredEquipment.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedMarker.requiredEquipment.slice(0, 2).map((equipment) => (
                        <span 
                          key={equipment}
                          className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {equipment}
                        </span>
                      ))}
                      {selectedMarker.requiredEquipment.length > 2 && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                          +{selectedMarker.requiredEquipment.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map controls overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button
          onClick={() => setViewState(prev => ({ ...prev, zoom: prev.zoom + 1 }))}
          className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center justify-center text-sm font-bold"
        >
          +
        </button>
        <button
          onClick={() => setViewState(prev => ({ ...prev, zoom: prev.zoom - 1 }))}
          className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center justify-center text-sm font-bold"
        >
          −
        </button>
      </div>

      {/* Status indicator with route metrics */}
      <div className="absolute bottom-3 left-3 space-y-2">
        <div className="flex items-center gap-2 p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
          {isCalculatingRoute ? (
            <>
              <RefreshCw className="w-3 h-3 text-chart-1 animate-spin" />
              <span className="text-xs text-muted-foreground">Calculating route...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">
                {markers.length} Jobs • Live Updates
              </span>
            </>
          )}
        </div>
        
        {/* Route metrics display */}
        {routeMetrics && !isCalculatingRoute && (
          <div className="p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Route className="w-3 h-3 text-chart-2" />
                <span className="text-muted-foreground">{routeMetrics.totalDistance}mi</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-chart-3" />
                <span className="text-muted-foreground">{routeMetrics.driveTime}min</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-chart-4">$</span>
                <span className="text-muted-foreground">{routeMetrics.fuelCost}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 p-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
        <div className="space-y-1">
          <p className="text-xs font-medium text-card-foreground mb-2">Crews</p>
          {mockCrews.slice(0, 4).map((crew, index) => (
            <div key={crew.id} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: crewColors[index] }}
              />
              <span className="text-xs text-muted-foreground">{crew.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RouteMap;
