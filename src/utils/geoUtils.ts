// src/utils/geoUtils.ts
import L from 'leaflet';

/**
 * Calculate the distance between two geographic points
 * @param pointA [lat, lng] coordinates of point A
 * @param pointB [lat, lng] coordinates of point B
 * @returns Distance in meters
 */
export const calculateDistance = (
  pointA: [number, number], 
  pointB: [number, number]
): number => {
  const latLngA = L.latLng(pointA[0], pointA[1]);
  const latLngB = L.latLng(pointB[0], pointB[1]);
  
  return latLngA.distanceTo(latLngB);
};

/**
 * Calculate the bearing (direction) between two points in degrees
 * @param pointA [lat, lng] coordinates of point A
 * @param pointB [lat, lng] coordinates of point B
 * @returns Bearing in degrees (0-360)
 */
export const calculateBearing = (
  pointA: [number, number], 
  pointB: [number, number]
): number => {
  const lat1 = pointA[0] * Math.PI / 180;
  const lat2 = pointB[0] * Math.PI / 180;
  const lng1 = pointA[1] * Math.PI / 180;
  const lng2 = pointB[1] * Math.PI / 180;
  
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360; // Normalize to 0-360
  
  return bearing;
};

/**
 * Calculate the midpoint between two geographic points
 * @param pointA [lat, lng] coordinates of point A
 * @param pointB [lat, lng] coordinates of point B
 * @returns Midpoint coordinates [lat, lng]
 */
export const calculateMidpoint = (
  pointA: [number, number], 
  pointB: [number, number]
): [number, number] => {
  const latLngA = L.latLng(pointA[0], pointA[1]);
  const latLngB = L.latLng(pointB[0], pointB[1]);
  
  // Simple averaging for approximation
  const lat = (latLngA.lat + latLngB.lat) / 2;
  const lng = (latLngA.lng + latLngB.lng) / 2;
  
  return [lat, lng];
};

/**
 * Calculate all distances between a set of pins
 * @param pins Array of pin coordinates
 * @returns Array of distance objects with fromPin, toPin, distance, bearing
 */
export const calculatePinDistances = (
  pins: [number, number][]
): { fromPin: number; toPin: number; distance: number; bearing: number }[] => {
  const distances = [];
  
  // Need at least 2 pins to calculate distances
  if (pins.length < 2) return [];
  
  // Calculate distances between all pins
  for (let i = 0; i < pins.length; i++) {
    for (let j = i + 1; j < pins.length; j++) {
      const distance = calculateDistance(pins[i], pins[j]);
      const bearing = calculateBearing(pins[i], pins[j]);
      
      distances.push({
        fromPin: i,
        toPin: j,
        distance,
        bearing
      });
    }
  }
  
  return distances;
};