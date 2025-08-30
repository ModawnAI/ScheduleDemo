"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, Source, Layer, MapRef } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  Home,
  Route,
  MapPin,
  Navigation,
  Clock,
  Users,
  RefreshCw,
  Maximize2,
  Minimize2,
  Plus,
  Edit3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Fuel,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Truck,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Thermometer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockCrews, getJobsByDate } from '@/data/mockData';
import { JobTicket, RouteMetrics } from '@/types';
import { 
  calculateRouteMetrics, 
  calculateHaversineDistance 
} from '@/lib/routeUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteUpdate {
  id: string;
  timestamp: Date;
  type: 'optimization' | 'traffic' | 'weather' | 'crew_update' | 'note';
  title: string;
  description: string;
  author?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface WeatherData {
  id: string;
  location: { lat: number; lng: number };
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

interface TrafficData {
  id: string;
  location: { lat: number; lng: number };
  severity: 'light' | 'moderate' | 'heavy' | 'severe';
  type: 'construction' | 'accident' | 'congestion' | 'road_closure';
  delay: number; // minutes
  description: string;
  affectedRoutes: string[];
}

interface OptimizedRoute {
  id: string;
  name: string;
  crewId: string;
  jobs: JobTicket[];
  metrics: RouteMetrics;
  status: 'active' | 'optimizing' | 'completed' | 'delayed';
  updates: RouteUpdate[];
  notes: string;
  weatherImpact?: number; // percentage impact
  trafficImpact?: number; // percentage impact
}

export default function RoutesPage() {
  const mapRef = useRef<MapRef>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const routeAnimationRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const animatedPointRef = useRef<GeoJSON.FeatureCollection | null>(null);
  
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<OptimizedRoute | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<JobTicket | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showWeatherLayer, setShowWeatherLayer] = useState(true);
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [viewState, setViewState] = useState({
    longitude: -118.2737,
    latitude: 34.0928,
    zoom: 11
  });

  // Generate weather data
  const generateWeatherData = useCallback((): WeatherData[] => {
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy'];
    const weatherPoints: WeatherData[] = [];
    
    // Generate weather data points across LA area
    for (let i = 0; i < 8; i++) {
      const lat = 34.0522 + (Math.random() - 0.5) * 0.3;
      const lng = -118.2437 + (Math.random() - 0.5) * 0.4;
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temp = condition === 'rainy' ? 60 + Math.random() * 15 : 70 + Math.random() * 20;
      
      weatherPoints.push({
        id: `weather-${i}`,
        location: { lat, lng },
        condition,
        temperature: Math.round(temp),
        humidity: condition === 'rainy' ? 70 + Math.random() * 25 : 40 + Math.random() * 30,
        windSpeed: condition === 'windy' ? 15 + Math.random() * 10 : 5 + Math.random() * 8,
        visibility: condition === 'rainy' ? 3 + Math.random() * 2 : 8 + Math.random() * 2,
        impact: condition === 'rainy' ? 'high' : condition === 'windy' ? 'medium' : 'low',
        description: `${condition.charAt(0).toUpperCase() + condition.slice(1)} conditions, ${Math.round(temp)}°F`
      });
    }
    
    return weatherPoints;
  }, []);

  // Generate traffic data
  const generateTrafficData = useCallback((): TrafficData[] => {
    const types: TrafficData['type'][] = ['construction', 'accident', 'congestion', 'road_closure'];
    const severities: TrafficData['severity'][] = ['light', 'moderate', 'heavy'];
    const trafficPoints: TrafficData[] = [];
    
    // Generate traffic incidents
    for (let i = 0; i < 6; i++) {
      const lat = 34.0522 + (Math.random() - 0.5) * 0.25;
      const lng = -118.2437 + (Math.random() - 0.5) * 0.35;
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const delay = severity === 'heavy' ? 15 + Math.random() * 20 : 
                   severity === 'moderate' ? 5 + Math.random() * 10 : 
                   2 + Math.random() * 5;
      
      trafficPoints.push({
        id: `traffic-${i}`,
        location: { lat, lng },
        severity,
        type,
        delay: Math.round(delay),
        description: `${type.replace('_', ' ').toUpperCase()} - ${Math.round(delay)} min delay`,
        affectedRoutes: ['route-1', 'route-2'].slice(0, Math.floor(Math.random() * 2) + 1)
      });
    }
    
    return trafficPoints;
  }, []);

  // Enhanced dummy data for route animation
  const generateRouteJobs = (crewName: string, routeId: string): JobTicket[] => {
    const baseCoords = {
      'Alpha Team': { lat: 34.0522, lng: -118.2437 }, // Downtown LA
      'Beta Team': { lat: 34.0928, lng: -118.3287 },  // West Hollywood
      'Gamma Team': { lat: 34.1478, lng: -118.1445 }, // Pasadena
      'Delta Team': { lat: 34.0194, lng: -118.4112 }  // Santa Monica (fixed - moved inland)
    };

    const base = baseCoords[crewName as keyof typeof baseCoords] || baseCoords['Alpha Team'];
    
    const jobTemplates = [
      { client: 'Sunrise Medical Center', address: '1245 Medical Dr', service: 'Lawn Maintenance', duration: '2 hours' },
      { client: 'Downtown Office Complex', address: '890 Business Blvd', service: 'Landscape Installation', duration: '3 hours' },
      { client: 'Riverside Shopping Plaza', address: '456 Commerce St', service: 'Tree & Shrub Care', duration: '1.5 hours' },
      { client: 'Green Valley Apartments', address: '789 Valley Rd', service: 'Irrigation Repair', duration: '2.5 hours' },
      { client: 'Tech Campus North', address: '321 Innovation Way', service: 'Seasonal Cleanup', duration: '2 hours' },
      { client: 'Westside Community Center', address: '654 Community Ave', service: 'Fertilization', duration: '1 hour' },
      { client: 'Heritage Park District', address: '2468 Park Ave', service: 'Pest Control', duration: '1.5 hours' },
      { client: 'University Campus East', address: '579 University Dr', service: 'Lawn Maintenance', duration: '2.5 hours' }
    ];

    return jobTemplates.slice(0, 6).map((template, index) => {
      // Create a realistic route pattern - jobs spread in a logical sequence
      const angle = (index * 60) * (Math.PI / 180); // 60 degrees apart
      const distance = 0.02 + (index * 0.008); // Increasing distance from base
      
      const lat = base.lat + (distance * Math.cos(angle)) + (Math.random() - 0.5) * 0.005;
      const lng = base.lng + (distance * Math.sin(angle)) + (Math.random() - 0.5) * 0.005;
      
      return {
        id: `${routeId}-job-${index + 1}`,
        clientId: `client-${index + 1}`,
        address: template.address,
        lat: lat,
        long: lng,
        task: template.service,
        estimatedHours: parseFloat(template.duration.split(' ')[0]) || 1,
        requiredEquipment: ['Standard Equipment'],
        requiredMaterials: ['Standard Materials'],
        serviceType: template.service,
        priority: index === 1 || index === 4 ? 'high' as const : index === 2 ? 'medium' as const : 'low' as const,
        status: 'pending' as const
      };
    });
  };

  // Mock optimized routes data with comprehensive job locations
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([
    {
      id: 'route-001',
      name: 'Alpha Team - North District',
      crewId: 'crew-001',
      jobs: generateRouteJobs('Alpha Team', 'route-001'),
      metrics: {
        totalDistance: 24.5,
        driveTime: 45,
        billableHours: 6.5,
        fuelCost: 18.50
      },
      status: 'active',
      updates: [
        {
          id: 'update-001',
          timestamp: new Date(Date.now() - 30 * 60000),
          type: 'optimization',
          title: 'Route Optimized',
          description: 'AI optimization reduced travel time by 15 minutes and fuel cost by $3.20',
          priority: 'medium'
        },
        {
          id: 'update-002',
          timestamp: new Date(Date.now() - 15 * 60000),
          type: 'traffic',
          title: 'Traffic Alert',
          description: 'Heavy traffic detected on Sunset Blvd. Rerouting to alternate path.',
          priority: 'high'
        }
      ],
      notes: 'Customer at Medical Center requested early arrival. Adjusted schedule accordingly.'
    },
    {
      id: 'route-002',
      name: 'Beta Team - South District',
      crewId: 'crew-002',
      jobs: generateRouteJobs('Beta Team', 'route-002'),
      metrics: {
        totalDistance: 18.2,
        driveTime: 38,
        billableHours: 5.5,
        fuelCost: 14.25
      },
      status: 'active',
      updates: [
        {
          id: 'update-003',
          timestamp: new Date(Date.now() - 45 * 60000),
          type: 'crew_update',
          title: 'Crew Check-in',
          description: 'Beta Team completed Corporate Plaza ahead of schedule',
          priority: 'low'
        }
      ],
      notes: 'Equipment maintenance scheduled after route completion.'
    },
    {
      id: 'route-003',
      name: 'Gamma Team - East District',
      crewId: 'crew-003',
      jobs: generateRouteJobs('Gamma Team', 'route-003'),
      metrics: {
        totalDistance: 21.8,
        driveTime: 42,
        billableHours: 6.0,
        fuelCost: 16.75
      },
      status: 'active',
      updates: [
        {
          id: 'update-004',
          timestamp: new Date(Date.now() - 20 * 60000),
          type: 'optimization',
          title: 'Route Updated',
          description: 'Added priority job at University Campus East',
          priority: 'medium'
        }
      ],
      notes: 'Focus on university campus - high visibility client.'
    },
    {
      id: 'route-004',
      name: 'Delta Team - West District',
      crewId: 'crew-004',
      jobs: generateRouteJobs('Delta Team', 'route-004'),
      metrics: {
        totalDistance: 19.6,
        driveTime: 35,
        billableHours: 5.0,
        fuelCost: 15.20
      },
      status: 'active',
      updates: [
        {
          id: 'update-005',
          timestamp: new Date(Date.now() - 10 * 60000),
          type: 'crew_update',
          title: 'Ahead of Schedule',
          description: 'Delta Team completed morning jobs 20 minutes early',
          priority: 'low'
        }
      ],
      notes: 'Coastal route - watch for marine layer affecting visibility.'
    }
  ]);

  // Crew colors for map markers
  const crewColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  const crewColorMap: { [key: string]: string } = {
    'Alpha Team': crewColors[0],
    'Beta Team': crewColors[1],
    'Gamma Team': crewColors[2],
    'Delta Team': crewColors[3]
  };

  // Get all jobs from selected routes
  const allJobs = optimizedRoutes.flatMap(route => 
    route.jobs.map(job => ({
      ...job,
      routeId: route.id,
      crewColor: crewColorMap[route.name.split(' - ')[0] || 'Alpha Team'] || crewColors[0]
    }))
  );

  // Animation functions
  const createAnimatedRoute = useCallback((jobs: JobTicket[]) => {
    console.log('Creating animated route for jobs:', jobs.length);
    
    if (jobs.length < 2) {
      console.log('Not enough jobs for animation');
      return null;
    }

    const coordinates = jobs.map(job => {
      const coord = [job.long, job.lat];
      console.log(`Job ${job.clientId}: [${coord[0]}, ${coord[1]}]`);
      return coord;
    });
    
    // Create a route with intermediate points for smooth animation
    const route = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: coordinates
          }
        }
      ]
    };

    console.log('Original route coordinates:', coordinates);

    // Calculate total distance and create arc with more points for smooth animation
    const lineDistance = turf.length(route.features[0]);
    console.log('Total line distance:', lineDistance, 'km');
    
    const steps = 100; // More steps for smoother animation
    console.log('Animation steps:', steps);
    
    const arc = [];

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push((segment.geometry as GeoJSON.Point).coordinates);
    }

    console.log('Generated arc with', arc.length, 'points');
    console.log('First few arc points:', arc.slice(0, 3));
    console.log('Last few arc points:', arc.slice(-3));

    (route.features[0].geometry as GeoJSON.LineString).coordinates = arc;
    return route;
  }, []);

  const startRouteAnimation = useCallback(() => {
    console.log('Starting animation for route:', selectedRoute?.name);
    console.log('Jobs count:', selectedRoute?.jobs?.length);
    
    if (!selectedRoute || selectedRoute.jobs.length < 2) {
      console.log('Cannot start animation: insufficient jobs');
      return;
    }

    // Get the native Mapbox map
    const map = mapRef.current?.getMap();
    if (!map) {
      console.log('Cannot start animation: no map reference');
      return;
    }

    console.log('Map found, creating animated route...');

    const animatedRoute = createAnimatedRoute(selectedRoute.jobs);
    if (!animatedRoute) {
      console.log('Failed to create animated route');
      return;
    }

    console.log('Animated route created with', (animatedRoute.features[0].geometry as GeoJSON.LineString).coordinates.length, 'points');
    routeAnimationRef.current = animatedRoute;
    
    // Create animated point
    const startPoint = selectedRoute.jobs[0];
    animatedPointRef.current = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            bearing: 0
          },
          geometry: {
            type: 'Point',
            coordinates: [startPoint.long, startPoint.lat]
          }
        }
      ]
    };

    console.log('Starting point:', { lat: startPoint.lat, lng: startPoint.long });

    // Clean up existing sources and layers
    try {
      if (map.getLayer('animated-route')) map.removeLayer('animated-route');
      if (map.getLayer('animated-point')) map.removeLayer('animated-point');
      if (map.getLayer('animated-point-pulse')) map.removeLayer('animated-point-pulse');
      if (map.getSource('animated-route')) map.removeSource('animated-route');
      if (map.getSource('animated-point')) map.removeSource('animated-point');
    } catch (e) {
      console.log('Cleanup error (expected):', e);
    }

    // Add sources and layers
    map.addSource('animated-route', {
      type: 'geojson',
      data: animatedRoute
    });

    map.addSource('animated-point', {
      type: 'geojson',
      data: animatedPointRef.current
    });

    map.addLayer({
      id: 'animated-route',
      source: 'animated-route',
      type: 'line',
      paint: {
        'line-width': 6,
        'line-color': crewColorMap[selectedRoute.name.split(' - ')[0] || 'Alpha Team'] || crewColors[0],
        'line-opacity': 0.8
      }
    });

    map.addLayer({
      id: 'animated-point',
      source: 'animated-point',
      type: 'circle',
      paint: {
        'circle-radius': 15,
        'circle-color': '#ff4444',
        'circle-stroke-width': 5,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 1.0
      }
    });

    // Add a pulsing effect layer
    map.addLayer({
      id: 'animated-point-pulse',
      source: 'animated-point',
      type: 'circle',
      paint: {
        'circle-radius': 25,
        'circle-color': '#ff4444',
        'circle-opacity': 0.3,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ff4444',
        'circle-stroke-opacity': 0.5
      }
    });

    console.log('Layers added, starting animation...');
    setIsAnimating(true);
    setAnimationProgress(0);
    animateRoute(0);
  }, [selectedRoute, createAnimatedRoute, crewColorMap, crewColors]);

  const animateRoute = useCallback((counter: number) => {
    console.log('=== Animate route called ===');
    console.log('Counter:', counter);
    console.log('isAnimating state:', isAnimating);
    
    if (!routeAnimationRef.current || !animatedPointRef.current) {
      console.log('Missing animation refs:', {
        routeAnimationRef: !!routeAnimationRef.current,
        animatedPointRef: !!animatedPointRef.current
      });
      return;
    }

    // Get the native Mapbox map
    const map = mapRef.current?.getMap();
    if (!map) {
      console.log('No map reference in animate');
      return;
    }

    const coordinates = (routeAnimationRef.current.features[0].geometry as GeoJSON.LineString).coordinates;
    const totalSteps = coordinates.length;

    console.log('Total steps:', totalSteps);
    console.log('Current step:', counter);

    if (counter >= totalSteps) {
      console.log('Animation complete - stopping');
      setIsAnimating(false);
      setAnimationProgress(100);
      return;
    }

    const currentCoord = coordinates[counter];
    const nextCoord = coordinates[counter + 1];

    console.log('Current coordinate:', currentCoord);
    console.log('Next coordinate:', nextCoord);

    if (currentCoord) {
      // Calculate bearing for rotation if we have next coordinate
      if (nextCoord && animatedPointRef.current) {
        const bearing = turf.bearing(turf.point(currentCoord), turf.point(nextCoord));
        const animatedPoint = animatedPointRef.current;
        if (animatedPoint && animatedPoint.features[0].properties) {
          animatedPoint.features[0].properties.bearing = bearing;
          console.log('Calculated bearing:', bearing);
        }
      }
      
      // Update the point position
      if (animatedPointRef.current) {
        const oldCoord = (animatedPointRef.current.features[0].geometry as GeoJSON.Point).coordinates;
        (animatedPointRef.current.features[0].geometry as GeoJSON.Point).coordinates = currentCoord;
        console.log('Updated coordinates from', oldCoord, 'to', currentCoord);
      }

      const pointSource = map.getSource('animated-point');
      if (pointSource && animatedPointRef.current) {
        (pointSource as mapboxgl.GeoJSONSource).setData(animatedPointRef.current);
        console.log('✅ Successfully updated point source');
      } else {
        console.log('❌ Point source not found');
      }

      const progress = (counter / totalSteps) * 100;
      setAnimationProgress(progress);
      console.log('Progress updated to:', progress + '%');

      // Continue animation - but check if we should still be animating
      console.log('Scheduling next animation step...');
      animationRef.current = setTimeout(() => {
        console.log('About to call next animation step');
        // Check if animation was stopped
        if (animationRef.current !== null) {
          animateRoute(counter + 1);
        } else {
          console.log('Animation was stopped, not continuing');
        }
      }, 500); // Slower for debugging
    }
  }, []); // Remove isAnimating dependency to avoid stale closure

  const stopAnimation = useCallback(() => {
    console.log('Stopping animation');
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const resetAnimation = useCallback(() => {
    console.log('Resetting animation');
    stopAnimation();
    setAnimationProgress(0);
    
    if (selectedRoute && selectedRoute.jobs.length > 0 && animatedPointRef.current) {
      const startPoint = selectedRoute.jobs[0];
      (animatedPointRef.current.features[0].geometry as GeoJSON.Point).coordinates = [startPoint.long, startPoint.lat];
      
      const map = mapRef.current?.getMap();
      if (map && map.getSource('animated-point')) {
        (map.getSource('animated-point') as mapboxgl.GeoJSONSource).setData(animatedPointRef.current);
        console.log('Reset point to start position');
      }
    }
  }, [selectedRoute, stopAnimation]);

  // Handle route optimization
  const handleOptimizeRoutes = useCallback(async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Add optimization update to all routes
    const optimizationUpdate: RouteUpdate = {
      id: `update-${Date.now()}`,
      timestamp: new Date(),
      type: 'optimization',
      title: 'Routes Re-optimized',
      description: 'All routes have been re-optimized based on current traffic and weather conditions',
      priority: 'medium'
    };

    setOptimizedRoutes(prev => prev.map(route => ({
      ...route,
      updates: [optimizationUpdate, ...route.updates],
      metrics: {
        ...route.metrics,
        driveTime: Math.max(20, route.metrics.driveTime - Math.floor(Math.random() * 10)),
        billableHours: route.metrics.billableHours,
        fuelCost: Math.max(10, (route.metrics.fuelCost || 15) - Math.random() * 3)
      }
    })));
    
    setIsOptimizing(false);
  }, []);

  // Handle adding notes
  const handleAddNote = useCallback(() => {
    if (!selectedRoute || !newNote.trim()) return;

    const noteUpdate: RouteUpdate = {
      id: `note-${Date.now()}`,
      timestamp: new Date(),
      type: 'note',
      title: 'Note Added',
      description: newNote.trim(),
      author: 'Current User',
      priority: 'low'
    };

    setOptimizedRoutes(prev => prev.map(route => 
      route.id === selectedRoute.id 
        ? { ...route, updates: [noteUpdate, ...route.updates] }
        : route
    ));

    setNewNote('');
    setIsAddingNote(false);
  }, [selectedRoute, newNote]);

  // Generate route line data for Mapbox
  const generateRouteLineData = (jobs: JobTicket[]) => {
    if (jobs.length < 2) return null;

    const coordinates = jobs.map(job => [job.long, job.lat]);
    
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates
      }
    };
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get update type icon
  const getUpdateIcon = (type: RouteUpdate['type']) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'traffic': return <AlertTriangle className="w-4 h-4" />;
      case 'weather': return <AlertTriangle className="w-4 h-4" />;
      case 'crew_update': return <Users className="w-4 h-4" />;
      case 'note': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'snowy': return <CloudSnow className="w-4 h-4 text-blue-300" />;
      case 'windy': return <Wind className="w-4 h-4 text-gray-600" />;
      default: return <Cloud className="w-4 h-4" />;
    }
  };

  const getTrafficColor = (severity: TrafficData['severity']) => {
    switch (severity) {
      case 'light': return '#22c55e'; // green
      case 'moderate': return '#f59e0b'; // yellow
      case 'heavy': return '#ef4444'; // red
      case 'severe': return '#dc2626'; // dark red
      default: return '#6b7280'; // gray
    }
  };

  // Initialize native Mapbox GL map for animations


  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Initialize weather and traffic data
  useEffect(() => {
    setWeatherData(generateWeatherData());
    setTrafficData(generateTrafficData());
  }, [generateWeatherData, generateTrafficData]);

  useEffect(() => {
    if (optimizedRoutes.length > 0 && !selectedRoute) {
      console.log('Setting default route:', optimizedRoutes[0]);
      setSelectedRoute(optimizedRoutes[0]);
    }
  }, [optimizedRoutes, selectedRoute]);

  // Debug log
  useEffect(() => {
    console.log('Selected route changed:', selectedRoute);
    console.log('Jobs in selected route:', selectedRoute?.jobs?.length || 0);
  }, [selectedRoute]);

  return (
    <div className="w-full bg-background text-foreground">
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Route Optimization</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Route className="w-6 h-6 sm:w-8 sm:h-8 text-chart-1" />
                  Route Optimization
                </h1>
                <p className="text-muted-foreground mt-1">
                  AI-powered route optimization with real-time updates and detailed tracking
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleOptimizeRoutes}
                  disabled={isOptimizing}
                  className="bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Routes
                    </>
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowWeatherLayer(!showWeatherLayer)}
                    variant={showWeatherLayer ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Cloud className="w-4 h-4" />
                    Weather
                  </Button>
                  
                  <Button
                    onClick={() => setShowTrafficLayer(!showTrafficLayer)}
                    variant={showTrafficLayer ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Traffic
                  </Button>
                </div>

                <Button
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                  variant="outline"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  {isMapExpanded ? (
                    <>
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Collapse Map
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Expand Map
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className={cn(
              "grid gap-4 md:gap-6 transition-all duration-300",
              isMapExpanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
            )}>
              
              {/* Map Section */}
              <div className={cn(
                "order-1 transition-all duration-300",
                isMapExpanded ? "col-span-1 h-[80vh]" : "lg:col-span-2 h-[60vh] lg:h-[70vh]"
              )}>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-chart-2" />
                        Live Route Map
                        {isOptimizing && (
                          <Badge className="bg-chart-1 text-primary-foreground animate-pulse">
                            Optimizing
                          </Badge>
                        )}
                      </CardTitle>
                      <Button
                        onClick={() => setIsMapExpanded(!isMapExpanded)}
                        variant="ghost"
                        size="sm"
                      >
                        {isMapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-4rem)] relative">
                    <Map
                      ref={mapRef}
                      {...viewState}
                      onMove={evt => setViewState(evt.viewState)}
                      style={{ width: '100%', height: '100%' }}
                      mapStyle="mapbox://styles/mapbox/light-v11"
                      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                    >
                      {/* Route lines */}
                      {optimizedRoutes.map((route) => {
                        const routeLineData = generateRouteLineData(route.jobs);
                        if (!routeLineData) return null;

                        return (
                          <Source
                            key={`route-${route.id}`}
                            id={`route-${route.id}`}
                            type="geojson"
                            data={routeLineData}
                          >
                            <Layer
                              id={`route-line-${route.id}`}
                              type="line"
                              paint={{
                                'line-color': crewColorMap[route.name.split(' - ')[0] || 'Alpha Team'] || crewColors[0],
                                'line-width': selectedRoute?.id === route.id ? 4 : 2,
                                'line-opacity': selectedRoute?.id === route.id ? 0.8 : 0.5
                              }}
                            />
                          </Source>
                        );
                      })}

                      {/* Job markers */}
                      {allJobs.map((job, index) => (
                        <Marker
                          key={job.id}
                          longitude={job.long}
                          latitude={job.lat}
                          anchor="bottom"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="cursor-pointer"
                            onClick={() => setSelectedMarker(job)}
                          >
                            <div 
                              className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                              style={{ backgroundColor: job.crewColor }}
                            >
                              <span className="text-xs font-bold text-white">
                                {index + 1}
                              </span>
                            </div>
                          </motion.div>
                        </Marker>
                      ))}

                      {/* Weather markers */}
                      {showWeatherLayer && weatherData.map((weather) => (
                        <Marker
                          key={weather.id}
                          longitude={weather.location.lng}
                          latitude={weather.location.lat}
                          anchor="center"
                        >
                          <div className="relative cursor-pointer" title={weather.description}>
                            <div className={`p-2 rounded-full border-2 border-white shadow-lg ${
                              weather.impact === 'high' ? 'bg-red-100' : 
                              weather.impact === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                              {getWeatherIcon(weather.condition)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs font-bold">
                              {weather.temperature}°
                            </div>
                          </div>
                        </Marker>
                      ))}

                      {/* Traffic markers */}
                      {showTrafficLayer && trafficData.map((traffic) => (
                        <Marker
                          key={traffic.id}
                          longitude={traffic.location.lng}
                          latitude={traffic.location.lat}
                          anchor="center"
                        >
                          <div className="relative cursor-pointer" title={traffic.description}>
                            <div 
                              className="p-2 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: getTrafficColor(traffic.severity) + '20' }}
                            >
                              <AlertTriangle 
                                className="w-4 h-4" 
                                style={{ color: getTrafficColor(traffic.severity) }}
                              />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center"
                                 style={{ backgroundColor: getTrafficColor(traffic.severity) }}>
                              {traffic.delay}
                            </div>
                          </div>
                        </Marker>
                      ))}

                      {/* Popup for selected marker */}
                      {selectedMarker && (
                        <Popup
                          longitude={selectedMarker.long}
                          latitude={selectedMarker.lat}
                          anchor="top"
                          onClose={() => setSelectedMarker(null)}
                          closeButton={false}
                          className="route-popup"
                        >
                          <div className="p-2 min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{selectedMarker.clientId}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedMarker(null)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{selectedMarker.address}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{selectedMarker.serviceType}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{selectedMarker.task}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      )}
                    </Map>

                    {/* Map overlay info and animation controls */}
                    <div className="absolute top-3 left-3 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
                        {isOptimizing ? (
                          <>
                            <RefreshCw className="w-3 h-3 text-chart-1 animate-spin" />
                            <span className="text-xs text-muted-foreground">Optimizing routes...</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
                            <span className="text-xs text-muted-foreground">
                              {allJobs.length} Jobs • {optimizedRoutes.length} Routes
                            </span>
                          </>
                        )}
                      </div>


                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-3 right-3 p-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-card-foreground mb-2">Active Routes</p>
                        {optimizedRoutes.map((route) => (
                          <div 
                            key={route.id} 
                            className={cn(
                              "flex items-center gap-2 cursor-pointer p-1 rounded transition-colors",
                              selectedRoute?.id === route.id ? "bg-accent" : "hover:bg-accent/50"
                            )}
                            onClick={() => setSelectedRoute(route)}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: crewColorMap[route.name.split(' - ')[0] || 'Alpha Team'] }}
                            />
                            <span className="text-xs text-muted-foreground">{route.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Route Details Panel */}
              <AnimatePresence>
                {!isMapExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="order-2 lg:order-2 space-y-4"
                  >
                    {/* Route Selection */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Route Details</CardTitle>
                        <CardDescription>
                          Select a route to view detailed information and updates
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {optimizedRoutes.map((route) => (
                            <Button
                              key={route.id}
                              variant={selectedRoute?.id === route.id ? "default" : "outline"}
                              className="w-full justify-start h-auto p-3"
                              onClick={() => setSelectedRoute(route)}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: crewColorMap[route.name.split(' - ')[0] || 'Alpha Team'] }}
                                />
                                <div className="text-left flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{route.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {route.jobs.length} jobs • {route.metrics.driveTime}min
                                  </div>
                                </div>
                                <Badge 
                                  variant={route.status === 'active' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {route.status}
                                </Badge>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Selected Route Information */}
                    {selectedRoute && (
                      <>
                        {/* Route Metrics */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-chart-2" />
                              Route Metrics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Route className="w-3 h-3" />
                                  Distance
                                </div>
                                <div className="text-lg font-bold text-chart-1">
                                  {selectedRoute.metrics.totalDistance}mi
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  Drive Time
                                </div>
                                <div className="text-lg font-bold text-chart-2">
                                  {selectedRoute.metrics.driveTime}min
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Fuel className="w-3 h-3" />
                                  Fuel Cost
                                </div>
                                <div className="text-lg font-bold text-chart-3">
                                  ${selectedRoute.metrics.fuelCost}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Zap className="w-3 h-3" />
                                  Efficiency
                                </div>
                                <div className="text-lg font-bold text-chart-4">
                                  {((selectedRoute.metrics.billableHours / (selectedRoute.metrics.driveTime / 60 + selectedRoute.metrics.billableHours)) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Route Animation Controls */}
                        {selectedRoute.jobs.length > 1 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="w-5 h-5 text-chart-2" />
                                Route Animation
                              </CardTitle>
                              <CardDescription>
                                Watch the optimized route in action
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={startRouteAnimation}
                                  disabled={isAnimating}
                                  className="flex items-center gap-2"
                                >
                                  <Play className="w-4 h-4" />
                                  Play
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  onClick={stopAnimation}
                                  disabled={!isAnimating}
                                  className="flex items-center gap-2"
                                >
                                  <Pause className="w-4 h-4" />
                                  Pause
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  onClick={resetAnimation}
                                  className="flex items-center gap-2"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  Reset
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{Math.round(animationProgress)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-chart-2 h-2 rounded-full transition-all duration-200"
                                    style={{ width: `${animationProgress}%` }}
                                  />
                                </div>
                              </div>

                              {isAnimating && (
                                <div className="flex items-center gap-2 text-sm text-chart-2">
                                  <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse" />
                                  Animating route...
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Weather & Traffic Impact */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Cloud className="w-5 h-5 text-chart-3" />
                              Environmental Conditions
                            </CardTitle>
                            <CardDescription>
                              Current weather and traffic affecting routes
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Weather Alerts</div>
                                <div className="space-y-1">
                                  {weatherData.filter(w => w.impact !== 'low').slice(0, 2).map(weather => (
                                    <div key={weather.id} className="flex items-center gap-2 text-xs">
                                      {getWeatherIcon(weather.condition)}
                                      <span className="truncate">{weather.description}</span>
                                    </div>
                                  ))}
                                  {weatherData.filter(w => w.impact !== 'low').length === 0 && (
                                    <div className="text-xs text-green-600 flex items-center gap-1">
                                      <Sun className="w-3 h-3" />
                                      Clear conditions
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Traffic Issues</div>
                                <div className="space-y-1">
                                  {trafficData.filter(t => t.severity !== 'light').slice(0, 2).map(traffic => (
                                    <div key={traffic.id} className="flex items-center gap-2 text-xs">
                                      <AlertTriangle 
                                        className="w-3 h-3" 
                                        style={{ color: getTrafficColor(traffic.severity) }}
                                      />
                                      <span className="truncate">{traffic.delay}min delay</span>
                                    </div>
                                  ))}
                                  {trafficData.filter(t => t.severity !== 'light').length === 0 && (
                                    <div className="text-xs text-green-600 flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Clear roads
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground mb-2">Overall Impact</div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Route Efficiency</span>
                                <Badge variant={
                                  weatherData.some(w => w.impact === 'high') || trafficData.some(t => t.severity === 'severe') 
                                    ? 'destructive' 
                                    : weatherData.some(w => w.impact === 'medium') || trafficData.some(t => t.severity === 'heavy')
                                    ? 'secondary'
                                    : 'default'
                                }>
                                  {weatherData.some(w => w.impact === 'high') || trafficData.some(t => t.severity === 'severe') 
                                    ? 'Impacted' 
                                    : weatherData.some(w => w.impact === 'medium') || trafficData.some(t => t.severity === 'heavy')
                                    ? 'Moderate'
                                    : 'Optimal'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Updates and Notes */}
                        <Card className="flex-1">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-chart-3" />
                                Updates & Notes
                              </CardTitle>
                              <Button
                                onClick={() => setIsAddingNote(!isAddingNote)}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Note
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Add Note Form */}
                            <AnimatePresence>
                              {isAddingNote && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-3 p-3 bg-muted/30 rounded-lg border"
                                >
                                  <Label htmlFor="new-note" className="text-sm font-medium">
                                    Add Note
                                  </Label>
                                  <Textarea
                                    id="new-note"
                                    placeholder="Enter your note or update..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="min-h-[80px]"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={handleAddNote}
                                      size="sm"
                                      disabled={!newNote.trim()}
                                    >
                                      <Save className="w-4 h-4 mr-1" />
                                      Save Note
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setIsAddingNote(false);
                                        setNewNote('');
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Updates List */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                              {selectedRoute.updates.map((update) => (
                                <motion.div
                                  key={update.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={cn(
                                    "p-3 rounded-lg border-l-4 bg-card",
                                    update.priority === 'high' ? 'border-l-red-500 bg-red-50/50' :
                                    update.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50/50' :
                                    'border-l-green-500 bg-green-50/50'
                                  )}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={cn(
                                      "p-1 rounded-full",
                                      update.priority === 'high' ? 'bg-red-100 text-red-600' :
                                      update.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                      'bg-green-100 text-green-600'
                                    )}>
                                      {getUpdateIcon(update.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{update.title}</h4>
                                        {update.priority && (
                                          <Badge 
                                            variant="outline" 
                                            className={cn("text-xs", getPriorityColor(update.priority))}
                                          >
                                            {update.priority}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        {update.description}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {update.timestamp.toLocaleString()}
                                        </span>
                                        {update.author && (
                                          <>
                                            <span>•</span>
                                            <span>{update.author}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                              
                              {selectedRoute.updates.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No updates yet</p>
                                  <p className="text-xs">Updates will appear here as they occur</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Expanded Map Details */}
            <AnimatePresence>
              {isMapExpanded && selectedRoute && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {/* Route Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{selectedRoute.name}</CardTitle>
                      <CardDescription>
                        {selectedRoute.jobs.length} jobs • {Math.round(selectedRoute.metrics.driveTime + selectedRoute.metrics.billableHours * 60)} min total
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Route className="w-4 h-4 text-chart-1" />
                            <span>{selectedRoute.metrics.totalDistance}mi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-chart-2" />
                            <span>{selectedRoute.metrics.driveTime}min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-chart-3" />
                            <span>${selectedRoute.metrics.fuelCost}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-chart-4" />
                            <span>{((selectedRoute.metrics.billableHours / (selectedRoute.metrics.driveTime / 60 + selectedRoute.metrics.billableHours)) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <Badge 
                          variant={selectedRoute.status === 'active' ? 'default' : 'secondary'}
                          className="w-full justify-center"
                        >
                          {selectedRoute.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job List */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Job Sequence</CardTitle>
                      <CardDescription>
                        Optimized order for maximum efficiency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {selectedRoute.jobs.map((job, index) => (
                          <div 
                            key={job.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedMarker(job)}
                          >
                            <div className="w-6 h-6 rounded-full bg-chart-1 text-white text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{job.clientId}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {job.address}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {job.estimatedHours}h
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Updates */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Recent Updates</CardTitle>
                      <CardDescription>
                        Latest route changes and notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {selectedRoute.updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="p-2 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-chart-2">
                                {getUpdateIcon(update.type)}
                              </div>
                              <span className="font-medium text-sm">{update.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {update.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {update.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                        
                        {selectedRoute.updates.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            <MessageSquare className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <p className="text-xs">No recent updates</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
}
