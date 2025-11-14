// GPlates Web Service API integration
// API Documentation: https://gwsdoc.gplates.org/

import { mapDataCache } from './mapCache'

export interface GPlatesConfig {
  time: number // millions of years ago
  model?: string
}

// Rotation angles (in degrees) to orient maps horizontally
// Positive values rotate clockwise
export const PERIOD_ROTATIONS: Record<string, number> = {
  'Permian': 90,
  'Triassic': 90,
  'Jurassic': 45,
  'Cretaceous': 0,
  'Paleocene': 0,
  'Eocene': 0,
  'Oligocene': 0,
  'Miocene': 0,
  'Pliocene': 0,
  'Pleistocene': 0,
  'Holocene': 0,
}

// Map period names to approximate ages in millions of years
export const PERIOD_AGES: Record<string, number> = {
  'Holocene': 0,
  'Pleistocene': 1,
  'Pliocene': 4,
  'Miocene': 15,
  'Oligocene': 28,
  'Eocene': 45,
  'Paleocene': 60,
  'Cretaceous': 100,
  'Jurassic': 170,
  'Triassic': 220,
  'Permian': 260,
}

/**
 * Fetch paleogeographic reconstruction from GPlates Web Service
 * Uses Next.js API route to avoid CORS issues
 * Includes client-side caching for improved performance
 */
export async function fetchPaleoGeography(period: string): Promise<any> {
  const age = PERIOD_AGES[period] || 100
  // Use MULLER2022 model which supports 0-1000 Ma (covers all our periods including Permian and Triassic)
  const model = 'MULLER2022'

  // Check cache first
  const cacheKey = `coastlines:${period}:${model}`
  const cached = mapDataCache.get(cacheKey)
  if (cached) {
    console.log(`Using cached data for ${period}`)
    return cached
  }

  try {
    // Use our API route proxy to avoid CORS issues
    const url = `/api/gplates/coastlines?time=${age}&model=${model}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`GPlates API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Cache the successful response
    mapDataCache.set(cacheKey, data)
    console.log(`Cached data for ${period}`)

    return data
  } catch (error) {
    console.error('Error fetching from GPlates:', error)
    // Return empty feature collection on error
    return {
      type: 'FeatureCollection',
      features: []
    }
  }
}

/**
 * Fetch continent polygons from GPlates
 * Uses Next.js API route to avoid CORS issues
 * Includes client-side caching for improved performance
 */
export async function fetchContinentPolygons(period: string): Promise<any> {
  const age = PERIOD_AGES[period] || 100
  // Use MULLER2022 model which supports 0-1000 Ma (covers all our periods including Permian and Triassic)
  const model = 'MULLER2022'

  // Check cache first
  const cacheKey = `polygons:${period}:${model}`
  const cached = mapDataCache.get(cacheKey)
  if (cached) {
    console.log(`Using cached polygon data for ${period}`)
    return cached
  }

  try {
    // Use our API route proxy to avoid CORS issues
    const url = `/api/gplates/polygons?time=${age}&model=${model}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`GPlates API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Cache the successful response
    mapDataCache.set(cacheKey, data)
    console.log(`Cached polygon data for ${period}`)

    return data
  } catch (error) {
    console.error('Error fetching polygons from GPlates:', error)
    return {
      type: 'FeatureCollection',
      features: []
    }
  }
}

/**
 * Rotate a coordinate [lng, lat] by a given angle (in degrees) around the origin
 */
function rotateCoordinate(coord: [number, number], angleDegrees: number): [number, number] {
  if (angleDegrees === 0) return coord

  const [lng, lat] = coord
  const angleRadians = (angleDegrees * Math.PI) / 180

  // Convert to radians
  const lngRad = (lng * Math.PI) / 180
  const latRad = (lat * Math.PI) / 180

  // Convert to 3D Cartesian coordinates
  const x = Math.cos(latRad) * Math.cos(lngRad)
  const y = Math.cos(latRad) * Math.sin(lngRad)
  const z = Math.sin(latRad)

  // Rotate around Z axis
  const cosAngle = Math.cos(angleRadians)
  const sinAngle = Math.sin(angleRadians)
  const xRotated = x * cosAngle - y * sinAngle
  const yRotated = x * sinAngle + y * cosAngle
  const zRotated = z

  // Convert back to lat/lng
  const latRotated = Math.asin(zRotated) * (180 / Math.PI)
  const lngRotated = Math.atan2(yRotated, xRotated) * (180 / Math.PI)

  return [lngRotated, latRotated]
}

/**
 * Recursively rotate all coordinates in a GeoJSON geometry
 */
function rotateGeometry(geometry: any, angleDegrees: number): any {
  if (angleDegrees === 0) return geometry

  const rotated = { ...geometry }

  if (geometry.type === 'Point') {
    rotated.coordinates = rotateCoordinate(geometry.coordinates, angleDegrees)
  } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
    rotated.coordinates = geometry.coordinates.map((coord: [number, number]) =>
      rotateCoordinate(coord, angleDegrees)
    )
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
    rotated.coordinates = geometry.coordinates.map((ring: [number, number][]) =>
      ring.map((coord: [number, number]) => rotateCoordinate(coord, angleDegrees))
    )
  } else if (geometry.type === 'MultiPolygon') {
    rotated.coordinates = geometry.coordinates.map((polygon: [number, number][][]) =>
      polygon.map((ring: [number, number][]) =>
        ring.map((coord: [number, number]) => rotateCoordinate(coord, angleDegrees))
      )
    )
  } else if (geometry.type === 'GeometryCollection') {
    rotated.geometries = geometry.geometries.map((geom: any) =>
      rotateGeometry(geom, angleDegrees)
    )
  }

  return rotated
}

/**
 * Rotate GeoJSON feature collection by a specified angle
 */
export function rotateGeoJSON(geoJson: any, angleDegrees: number): any {
  if (angleDegrees === 0) return geoJson

  const rotated = { ...geoJson }

  if (geoJson.type === 'FeatureCollection') {
    rotated.features = geoJson.features.map((feature: any) => ({
      ...feature,
      geometry: rotateGeometry(feature.geometry, angleDegrees)
    }))
  } else if (geoJson.type === 'Feature') {
    rotated.geometry = rotateGeometry(geoJson.geometry, angleDegrees)
  } else {
    return rotateGeometry(geoJson, angleDegrees)
  }

  return rotated
}

/**
 * Get information about a geological period
 */
export function getPeriodInfo(period: string) {
  const age = PERIOD_AGES[period]
  return {
    name: period,
    age,
    ageText: age === 0 ? 'Present' : `${age} million years ago`
  }
}
