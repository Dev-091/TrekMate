import { TrekPath, NavigationState, SafetyAlert } from './mapbox';

// AI Assistant Configuration
export interface AIVoiceConfig {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface NavigationGuidance {
  instruction: string;
  distance: number;
  direction: string;
  estimatedTime: number;
  safetyWarnings: string[];
  landmarks: string[];
  nextWaypoint: string;
}

export interface VisualAnalysis {
  pathDirection: string;
  terrainType: string;
  obstacles: string[];
  landmarks: string[];
  safetyAlerts: string[];
  recommendations: string[];
}

// AI Assistant Service
export class TrekAIAssistant {
  private speechSynthesis: SpeechSynthesis;
  private currentVoice: SpeechSynthesisVoice | null = null;
  private isSpeaking = false;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.initializeVoice();
  }

  private initializeVoice() {
    // Wait for voices to load
    if (this.speechSynthesis.getVoices().length === 0) {
      this.speechSynthesis.addEventListener('voiceschanged', () => {
        this.setVoice();
      });
    } else {
      this.setVoice();
    }
  }

  private setVoice() {
    const voices = this.speechSynthesis.getVoices();
    // Prefer Indian English voice, fallback to any English voice
    this.currentVoice = voices.find(voice => 
      voice.lang.includes('en-IN') || 
      (voice.lang.includes('en') && voice.name.includes('India'))
    ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
  }

  // Voice Navigation Functions
  speak(text: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    if (this.isSpeaking && priority !== 'critical') {
      return; // Don't interrupt unless critical
    }

    // Stop current speech
    this.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.currentVoice;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Add emphasis for critical messages
    if (priority === 'critical') {
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
    }

    this.isSpeaking = true;
    utterance.onend = () => {
      this.isSpeaking = false;
    };

    this.speechSynthesis.speak(utterance);
  }

  // Navigation Guidance
  provideNavigationGuidance(
    currentLocation: [number, number],
    trekPath: TrekPath,
    navigationState: NavigationState
  ): NavigationGuidance {
    const nextWaypoint = this.findNextWaypoint(currentLocation, trekPath);
    const distance = this.calculateDistanceToWaypoint(currentLocation, nextWaypoint);
    const direction = this.getDirectionToWaypoint(currentLocation, nextWaypoint);
    const estimatedTime = this.estimateTimeToWaypoint(distance, trekPath.difficulty);

    const instruction = this.generateNavigationInstruction(
      distance,
      direction,
      nextWaypoint,
      trekPath
    );

    const safetyWarnings = this.getSafetyWarnings(navigationState);
    const landmarks = this.getNearbyLandmarks(currentLocation, trekPath);

    return {
      instruction,
      distance,
      direction,
      estimatedTime,
      safetyWarnings,
      landmarks,
      nextWaypoint: nextWaypoint?.name || 'Unknown location'
    };
  }

  // Visual Analysis (Camera-based navigation)
  async analyzeVisualPath(imageFile: File, currentLocation: [number, number], trekPath: TrekPath): Promise<VisualAnalysis> {
    try {
      // Convert image to base64 for AI analysis
      const base64Image = await this.imageToBase64(imageFile);
      
      // This would integrate with OpenAI GPT-4 Vision or similar AI service
      // For now, returning mock analysis
      const analysis = await this.mockVisualAnalysis(base64Image, currentLocation, trekPath);
      
      return analysis;
    } catch (error) {
      console.error('Visual analysis failed:', error);
      return {
        pathDirection: 'Unable to determine path direction',
        terrainType: 'Unknown terrain',
        obstacles: ['Analysis failed - proceed with caution'],
        landmarks: [],
        safetyAlerts: ['Visual analysis unavailable - rely on GPS navigation'],
        recommendations: ['Use GPS navigation and stay on marked trails']
      };
    }
  }

  // Emergency and Safety Functions
  provideEmergencyGuidance(alert: SafetyAlert): string {
    const emergencyInstructions = {
      weather: {
        critical: 'CRITICAL: Severe weather detected. Seek immediate shelter. Do not continue trekking.',
        high: 'WARNING: Dangerous weather conditions. Consider turning back or finding shelter.',
        medium: 'CAUTION: Weather conditions deteriorating. Monitor closely.',
        low: 'Notice: Weather conditions may change. Stay alert.'
      },
      terrain: {
        critical: 'CRITICAL: Dangerous terrain ahead. Turn back immediately.',
        high: 'WARNING: Difficult terrain detected. Proceed with extreme caution.',
        medium: 'CAUTION: Challenging terrain ahead. Slow down and be careful.',
        low: 'Notice: Terrain changes ahead. Stay on marked path.'
      },
      wildlife: {
        critical: 'CRITICAL: Wildlife threat detected. Do not approach. Back away slowly.',
        high: 'WARNING: Wildlife in area. Make noise and stay alert.',
        medium: 'CAUTION: Wildlife may be present. Stay on trail.',
        low: 'Notice: Wildlife habitat area. Respect their space.'
      },
      medical: {
        critical: 'CRITICAL: Medical emergency. Call emergency services immediately.',
        high: 'WARNING: Medical attention may be needed. Assess situation.',
        medium: 'CAUTION: Monitor health conditions. Rest if needed.',
        low: 'Notice: Take regular breaks and stay hydrated.'
      }
    };

    const instruction = emergencyInstructions[alert.type]?.[alert.severity] || 
                       'Alert: Please check your surroundings and proceed with caution.';
    
    this.speak(instruction, alert.severity);
    return instruction;
  }

  // Weather and Environmental Guidance
  provideWeatherGuidance(weatherInfo: any, trekPath: TrekPath): string {
    const { temperature, condition, visibility, windSpeed } = weatherInfo;
    
    let guidance = '';
    
    if (temperature < 0) {
      guidance += 'WARNING: Freezing temperatures. Ensure proper thermal protection. ';
    } else if (temperature > 35) {
      guidance += 'WARNING: High temperatures. Stay hydrated and avoid heat exhaustion. ';
    }
    
    if (visibility < 100) {
      guidance += 'CAUTION: Low visibility. Stay on marked trails and use GPS navigation. ';
    }
    
    if (windSpeed > 50) {
      guidance += 'WARNING: High winds. Be cautious of falling branches and debris. ';
    }
    
    if (condition.includes('rain') || condition.includes('snow')) {
      guidance += 'CAUTION: Wet conditions. Trails may be slippery. Use appropriate footwear. ';
    }
    
    return guidance || 'Weather conditions are suitable for trekking. Continue with normal precautions.';
  }

  // Helper Functions
  private findNextWaypoint(currentLocation: [number, number], trekPath: TrekPath) {
    // Find the next waypoint based on current location
    const waypoints = [...trekPath.landmarks, ...trekPath.campsites];
    let closestWaypoint = null;
    let minDistance = Infinity;

    for (const waypoint of waypoints) {
      const distance = this.calculateDistance(currentLocation, waypoint.coordinates);
      if (distance < minDistance && distance > 0.1) { // At least 100m away
        minDistance = distance;
        closestWaypoint = waypoint;
      }
    }

    return closestWaypoint;
  }

  private calculateDistanceToWaypoint(currentLocation: [number, number], waypoint: any): number {
    if (!waypoint) return 0;
    return this.calculateDistance(currentLocation, waypoint.coordinates);
  }

  private getDirectionToWaypoint(currentLocation: [number, number], waypoint: any): string {
    if (!waypoint) return 'Unknown';
    const bearing = this.calculateBearing(currentLocation, waypoint.coordinates);
    return this.getDirectionText(bearing);
  }

  private estimateTimeToWaypoint(distance: number, difficulty: 'Easy' | 'Moderate' | 'Challenging'): number {
    const speedMultipliers: { [key in 'Easy' | 'Moderate' | 'Challenging']: number } = {
      Easy: 4, // 4 km/h
      Moderate: 3, // 3 km/h
      Challenging: 2 // 2 km/h
    };
    
    const speed = speedMultipliers[difficulty] || 3;
    return Math.round((distance / speed) * 60); // Return minutes
  }

  private generateNavigationInstruction(
    distance: number,
    direction: string,
    waypoint: any,
    trekPath: TrekPath
  ): string {
    if (!waypoint) {
      return 'Continue following the marked trail. Stay alert for trail markers.';
    }

    const distanceText = distance < 1 ? 
      `${Math.round(distance * 1000)} meters` : 
      `${distance.toFixed(1)} kilometers`;

    return `Continue ${direction.toLowerCase()} for ${distanceText} to reach ${waypoint.name}. ${waypoint.description || 'Stay on the marked trail.'}`;
  }

  private getSafetyWarnings(navigationState: NavigationState): string[] {
    const warnings = [];
    
    if (navigationState.safetyAlerts.length > 0) {
      warnings.push(...navigationState.safetyAlerts.map(alert => alert.message));
    }
    
    if (navigationState.currentTrek) {
      warnings.push(...navigationState.currentTrek.warnings);
    }
    
    return warnings;
  }

  private getNearbyLandmarks(currentLocation: [number, number], trekPath: TrekPath): string[] {
    const nearbyLandmarks = [];
    
    for (const landmark of trekPath.landmarks) {
      const distance = this.calculateDistance(currentLocation, landmark.coordinates);
      if (distance < 2) { // Within 2km
        nearbyLandmarks.push(`${landmark.name} (${distance.toFixed(1)}km away)`);
      }
    }
    
    return nearbyLandmarks;
  }

  private async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async mockVisualAnalysis(base64Image: string, currentLocation: [number, number], trekPath: TrekPath): Promise<VisualAnalysis> {
    // Mock analysis - in real implementation, this would call AI service
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing
    
    return {
      pathDirection: 'Continue straight ahead on the marked trail',
      terrainType: 'Rocky mountain path',
      obstacles: ['Small rocks on path', 'Steep incline ahead'],
      landmarks: ['Mountain peak visible to the right', 'Stream crossing ahead'],
      safetyAlerts: ['Watch for loose rocks', 'Stay on marked trail'],
      recommendations: ['Use trekking poles for stability', 'Take regular breaks on steep sections']
    };
  }

  // Utility functions (copied from mapbox.ts for convenience)
  private calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateBearing(coord1: [number, number], coord2: [number, number]): number {
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const lat1 = coord1[1] * Math.PI / 180;
    const lat2 = coord2[1] * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return Math.atan2(y, x) * 180 / Math.PI;
  }

  private getDirectionText(bearing: number): string {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }
}

// Create singleton instance
export const trekAI = new TrekAIAssistant(); 