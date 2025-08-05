"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MAP_CONFIG, 
  sampleTrekPaths, 
  TrekPath, 
  NavigationState,
  calculateDistance,
  calculateBearing,
  getDirectionText
} from "@/lib/mapbox";
import { trekAI, NavigationGuidance, VisualAnalysis } from "@/lib/ai-assistant";

// Fix Leaflet marker icons for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, letter: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color}; 
      width: 30px; 
      height: 30px; 
      border-radius: 50%; 
      border: 3px solid white; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      font-weight: bold; 
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${letter}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Map component for real-time location updates
function LocationMarker({ currentLocation, isNavigating }: { currentLocation: [number, number] | null, isNavigating: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (currentLocation && isNavigating) {
      map.setView(currentLocation, 15);
    }
  }, [currentLocation, isNavigating, map]);

  if (!currentLocation) return null;

  return (
    <Marker 
      position={currentLocation}
      icon={createCustomIcon('#FF6B35', '📍')}
    >
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong><br />
          {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
        </div>
      </Popup>
    </Marker>
  );
}

export default function NavigationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const trekId = searchParams.get('trekId');
  
  // State management
  const [currentTrek, setCurrentTrek] = useState<TrekPath | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentLocation: null,
    currentTrek: null,
    progress: 0,
    nextWaypoint: null,
    distanceToNext: 0,
    estimatedTimeToNext: 0,
    currentElevation: 0,
    weatherConditions: {
      temperature: 20,
      condition: 'Clear',
      visibility: 100,
      windSpeed: 10,
      precipitation: 0,
      updatedAt: new Date()
    },
    safetyAlerts: []
  });
  
  // UI state
  const [isNavigating, setIsNavigating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraImage, setCameraImage] = useState<string | null>(null);
  const [visualAnalysis, setVisualAnalysis] = useState<VisualAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastGuidance, setLastGuidance] = useState<NavigationGuidance | null>(null);
  
  // Refs
  const mapRef = useRef<any>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize trek and navigation
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/choice");
      return;
    }

    if (trekId) {
      const trek = sampleTrekPaths.find(t => t.id === trekId);
      if (trek) {
        setCurrentTrek(trek);
        setNavigationState(prev => ({ ...prev, currentTrek: trek }));
      }
    }
  }, [trekId, user, loading, router]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setNavigationState(prev => ({ ...prev, currentLocation: [latitude, longitude] }));
        },
        (error) => {
          console.error('Error getting location:', error);
          trekAI.speak('Unable to get your current location. Please enable location services.', 'high');
        }
      );
    }
  }, []);

  // Start navigation tracking
  const startNavigation = useCallback(() => {
    if (!currentTrek || !currentLocation) return;

    setIsNavigating(true);
    trekAI.speak(`Starting navigation for ${currentTrek.name}. Stay on the marked trail and follow voice guidance.`);

    // Update location every 10 seconds
    locationIntervalRef.current = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
            updateNavigationState([latitude, longitude]);
          },
          (error) => {
            console.error('Error updating location:', error);
          }
        );
      }
    }, 10000);

    // Provide initial guidance
    provideNavigationGuidance();
  }, [currentTrek, currentLocation]);

  // Stop navigation
  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    trekAI.speak('Navigation stopped. Stay safe and enjoy your trek.');
  }, []);

  // Update navigation state
  const updateNavigationState = useCallback((location: [number, number]) => {
    if (!currentTrek) return;

    // Calculate progress
    const totalDistance = currentTrek.coordinates.reduce((total, coord, index) => {
      if (index > 0) {
        return total + calculateDistance(currentTrek.coordinates[index - 1], coord);
      }
      return total;
    }, 0);

    const distanceFromStart = calculateDistance(currentTrek.startPoint, location);
    const progress = Math.min((distanceFromStart / totalDistance) * 100, 100);

    // Find next waypoint
    const waypoints = [...currentTrek.landmarks, ...currentTrek.campsites];
    let nextWaypoint = null;
    let minDistance = Infinity;

    for (const waypoint of waypoints) {
      const distance = calculateDistance(location, waypoint.coordinates);
      if (distance < minDistance && distance > 0.1) {
        minDistance = distance;
        nextWaypoint = waypoint;
      }
    }

    setNavigationState(prev => ({
      ...prev,
      currentLocation: location,
      progress,
      nextWaypoint,
      distanceToNext: minDistance,
      estimatedTimeToNext: Math.round((minDistance / (currentTrek.difficulty === 'Easy' ? 4 : currentTrek.difficulty === 'Moderate' ? 3 : 2)) * 60)
    }));
  }, [currentTrek]);

  // Provide navigation guidance
  const provideNavigationGuidance = useCallback(() => {
    if (!currentLocation || !currentTrek) return;

    const guidance = trekAI.provideNavigationGuidance(currentLocation, currentTrek, navigationState);
    setLastGuidance(guidance);

    if (voiceEnabled) {
      trekAI.speak(guidance.instruction);
    }

    // Check for safety alerts
    if (guidance.safetyWarnings.length > 0) {
      guidance.safetyWarnings.forEach(warning => {
        trekAI.speak(`Safety warning: ${warning}`, 'high');
      });
    }
  }, [currentLocation, currentTrek, navigationState, voiceEnabled]);

  // Handle camera capture
  const handleCameraCapture = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentLocation || !currentTrek) return;

    setIsAnalyzing(true);
    setCameraImage(URL.createObjectURL(file));

    try {
      const analysis = await trekAI.analyzeVisualPath(file, currentLocation, currentTrek);
      setVisualAnalysis(analysis);
      
      if (voiceEnabled) {
        trekAI.speak(`Visual analysis complete. ${analysis.pathDirection}`);
        if (analysis.safetyAlerts.length > 0) {
          analysis.safetyAlerts.forEach(alert => {
            trekAI.speak(`Safety alert: ${alert}`, 'high');
          });
        }
      }
    } catch (error) {
      console.error('Visual analysis failed:', error);
      trekAI.speak('Visual analysis failed. Please rely on GPS navigation.', 'medium');
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentLocation, currentTrek, voiceEnabled]);

  // Emergency functions
  const triggerEmergency = useCallback((type: 'medical' | 'weather' | 'terrain' | 'wildlife') => {
    const alert = {
      id: Date.now().toString(),
      type,
      severity: 'critical' as const,
      message: `Emergency alert: ${type} emergency detected. Seek immediate assistance.`,
      coordinates: currentLocation || [0, 0],
      timestamp: new Date()
    };

    trekAI.provideEmergencyGuidance(alert);
    
    // Add to safety alerts
    setNavigationState(prev => ({
      ...prev,
      safetyAlerts: [...prev.safetyAlerts, alert]
    }));
  }, [currentLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p>Loading navigation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-[var(--primary)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
            </svg>
            <h2 className="text-white text-2xl font-bold tracking-tighter">TrekMate Navigation</h2>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-stone-300">Welcome, {user.email}</span>
            <Link href="/dashboard" className="text-[var(--primary)] hover:underline">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Navigation Interface */}
      <div className="pt-24 h-screen">
        <div className="relative h-full">
          {/* Map */}
          <MapContainer
            center={MAP_CONFIG.center}
            zoom={MAP_CONFIG.zoom}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
            attributionControl={true}
          >
            {/* OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Current Location Marker */}
            <LocationMarker currentLocation={currentLocation} isNavigating={isNavigating} />

            {/* Trek Path */}
            {currentTrek && (
              <Polyline
                positions={currentTrek.coordinates}
                color="#FF6B35"
                weight={4}
                opacity={0.8}
              />
            )}

            {/* Campsites */}
            {currentTrek?.campsites.map((campsite) => (
              <Marker key={campsite.id} position={campsite.coordinates} icon={createCustomIcon('#10B981', 'C')}>
                <Popup>
                  <div className="text-center">
                    <strong>{campsite.name}</strong><br />
                    Elevation: {campsite.elevation}m<br />
                    Capacity: {campsite.capacity}<br />
                    {campsite.waterSource && '💧 Water Available'}<br />
                    {campsite.shelter && '🏠 Shelter Available'}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Emergency Points */}
            {currentTrek?.emergencyPoints.map((point) => (
              <Marker key={point.id} position={point.coordinates} icon={createCustomIcon('#EF4444', 'E')}>
                <Popup>
                  <div className="text-center">
                    <strong>{point.name}</strong><br />
                    {point.description}<br />
                    Contact: {point.contact}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Landmarks */}
            {currentTrek?.landmarks.map((landmark) => (
              <Marker key={landmark.id} position={landmark.coordinates} icon={createCustomIcon('#3B82F6', 'L')}>
                <Popup>
                  <div className="text-center">
                    <strong>{landmark.name}</strong><br />
                    {landmark.description}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Navigation Controls Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-stone-950/90 backdrop-blur-sm rounded-2xl p-6 border border-stone-800">
              {/* Navigation Status */}
              {currentTrek && (
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{currentTrek.name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-stone-300">Progress: {Math.round(navigationState.progress)}%</span>
                    <span className="text-stone-300">Distance: {navigationState.distanceToNext.toFixed(1)}km</span>
                    <span className="text-stone-300">Time: {navigationState.estimatedTimeToNext}min</span>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center gap-4">
                {!isNavigating ? (
                  <button
                    onClick={startNavigation}
                    disabled={!currentTrek || !currentLocation}
                    className="flex-1 bg-[var(--primary)] text-black font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Navigation
                  </button>
                ) : (
                  <button
                    onClick={stopNavigation}
                    className="flex-1 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Stop Navigation
                  </button>
                )}

                <button
                  onClick={() => setShowCamera(!showCamera)}
                  className="bg-stone-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-stone-700 transition-all duration-300"
                >
                  📷 Camera
                </button>

                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
                    voiceEnabled 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-stone-800 text-white hover:bg-stone-700'
                  }`}
                >
                  {voiceEnabled ? '🔊' : '🔇'}
                </button>

                <button
                  onClick={() => provideNavigationGuidance()}
                  disabled={!isNavigating}
                  className="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗣️ Guide
                </button>
              </div>

              {/* Camera Interface */}
              {showCamera && (
                <div className="mt-4 p-4 bg-stone-900 rounded-lg">
                  <div className="flex items-center gap-4">
                    <input
                      ref={cameraRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                    <button
                      onClick={() => cameraRef.current?.click()}
                      className="bg-[var(--primary)] text-black font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                    >
                      📸 Take Photo
                    </button>
                    {isAnalyzing && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]"></div>
                        <span className="text-stone-300">Analyzing...</span>
                      </div>
                    )}
                  </div>

                  {/* Visual Analysis Results */}
                  {visualAnalysis && (
                    <div className="mt-4 p-3 bg-stone-800 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Visual Analysis:</h4>
                      <p className="text-stone-300 text-sm mb-2">{visualAnalysis.pathDirection}</p>
                      {visualAnalysis.safetyAlerts.length > 0 && (
                        <div className="text-red-400 text-sm">
                          <strong>Safety Alerts:</strong>
                          <ul className="list-disc list-inside">
                            {visualAnalysis.safetyAlerts.map((alert, index) => (
                              <li key={index}>{alert}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Emergency Buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => triggerEmergency('medical')}
                  className="bg-red-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
                >
                  🚑 Medical
                </button>
                <button
                  onClick={() => triggerEmergency('weather')}
                  className="bg-orange-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-orange-700 transition-all duration-300 text-sm"
                >
                  ⛈️ Weather
                </button>
                <button
                  onClick={() => triggerEmergency('terrain')}
                  className="bg-yellow-600 text-black font-bold py-2 px-3 rounded-lg hover:bg-yellow-700 transition-all duration-300 text-sm"
                >
                  ⚠️ Terrain
                </button>
                <button
                  onClick={() => triggerEmergency('wildlife')}
                  className="bg-purple-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-purple-700 transition-all duration-300 text-sm"
                >
                  🐾 Wildlife
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Guidance Panel */}
          {lastGuidance && (
            <div className="absolute top-24 right-6 w-80 bg-stone-950/90 backdrop-blur-sm rounded-2xl p-4 border border-stone-800">
              <h4 className="font-bold text-white mb-2">Navigation Guidance</h4>
              <p className="text-stone-300 text-sm mb-2">{lastGuidance.instruction}</p>
              <div className="text-xs text-stone-400">
                <p>Next: {lastGuidance.nextWaypoint}</p>
                <p>Distance: {lastGuidance.distance.toFixed(1)}km</p>
                <p>Time: {lastGuidance.estimatedTime}min</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 