import mapboxgl from 'mapbox-gl';

// Free OpenStreetMap configuration (no API key needed)
export const MAP_CONFIG = {
  center: [20.5937, 78.9629] as [number, number], // Center of India
  zoom: 5,
  maxZoom: 18,
  minZoom: 3,
};

// Trek path types
export interface TrekPath {
  id: string;
  name: string;
  coordinates: [number, number][];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  elevation: number;
  distance: number;
  estimatedDuration: number;
  startPoint: [number, number];
  endPoint: [number, number];
  campsites: Campsite[];
  emergencyPoints: EmergencyPoint[];
  landmarks: Landmark[];
  warnings: string[];
  safetyNotes: string[];
}

export interface Campsite {
  id: string;
  name: string;
  coordinates: [number, number];
  elevation: number;
  facilities: string[];
  waterSource: boolean;
  shelter: boolean;
  capacity: number;
  bookingRequired: boolean;
}

export interface EmergencyPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'helipad' | 'medical' | 'ranger' | 'emergency_phone';
  contact: string;
  description: string;
}

export interface Landmark {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'viewpoint' | 'waterfall' | 'lake' | 'peak' | 'bridge' | 'junction';
  description: string;
  photoUrl?: string;
}

export interface NavigationState {
  currentLocation: [number, number] | null;
  currentTrek: TrekPath | null;
  progress: number; // 0-100
  nextWaypoint: Landmark | Campsite | null;
  distanceToNext: number;
  estimatedTimeToNext: number;
  currentElevation: number;
  weatherConditions: WeatherInfo;
  safetyAlerts: SafetyAlert[];
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  visibility: number;
  windSpeed: number;
  precipitation: number;
  updatedAt: Date;
}

export interface SafetyAlert {
  id: string;
  type: 'weather' | 'terrain' | 'wildlife' | 'medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  coordinates: [number, number];
  timestamp: Date;
}

// Trek path data (sample data for Indian treks)
export const sampleTrekPaths: TrekPath[] = [
  {
    id: 'himalayan-ascent',
    name: 'Himalayan Ascent',
    coordinates: [
      [30.0668, 78.9629], // Start point (latitude, longitude for Leaflet)
      [30.0672, 78.9635],
      [30.0678, 78.9641],
      [30.0685, 78.9648],
      [30.0692, 78.9655],
      [30.0698, 78.9662],
      [30.0705, 78.9669], // End point
    ],
    difficulty: 'Moderate',
    elevation: 4500,
    distance: 12.5,
    estimatedDuration: 7,
    startPoint: [30.0668, 78.9629],
    endPoint: [30.0705, 78.9669],
    campsites: [
      {
        id: 'camp-1',
        name: 'Base Camp',
        coordinates: [30.0672, 78.9635],
        elevation: 2800,
        facilities: ['water', 'shelter', 'fire_pit'],
        waterSource: true,
        shelter: true,
        capacity: 20,
        bookingRequired: false,
      },
      {
        id: 'camp-2',
        name: 'High Camp',
        coordinates: [30.0692, 78.9655],
        elevation: 3800,
        facilities: ['water', 'shelter'],
        waterSource: true,
        shelter: true,
        capacity: 12,
        bookingRequired: true,
      },
    ],
    emergencyPoints: [
      {
        id: 'emergency-1',
        name: 'Emergency Helipad',
        coordinates: [30.0678, 78.9641],
        type: 'helipad',
        contact: '+91-1234567890',
        description: 'Emergency evacuation point',
      },
    ],
    landmarks: [
      {
        id: 'landmark-1',
        name: 'Sunrise Point',
        coordinates: [30.0685, 78.9648],
        type: 'viewpoint',
        description: 'Spectacular sunrise view of the Himalayas',
      },
    ],
    warnings: [
      'High altitude - acclimatization required',
      'Weather can change rapidly',
      'Carry sufficient water and supplies',
    ],
    safetyNotes: [
      'Check weather forecast before starting',
      'Inform someone about your trek plan',
      'Carry emergency contact numbers',
      'Stay on marked trails only',
    ],
  },
  // Add more trek paths here
];

// Navigation utilities
export const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const calculateBearing = (coord1: [number, number], coord2: [number, number]): number => {
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const lat1 = coord1[0] * Math.PI / 180;
  const lat2 = coord2[0] * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return Math.atan2(y, x) * 180 / Math.PI;
};

export const getDirectionText = (bearing: number): string => {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}; 