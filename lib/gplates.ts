// GPlates Web Service API integration
// API Documentation: https://gwsdoc.gplates.org/

export interface GPlatesConfig {
  time: number // millions of years ago
  model?: string
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
 */
export async function fetchPaleoGeography(period: string): Promise<any> {
  const age = PERIOD_AGES[period] || 100
  const model = 'SETON2012'

  try {
    // GPlates Web Service endpoint for coastlines
    const url = `https://gws.gplates.org/reconstruct/coastlines/?time=${age}&model=${model}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`GPlates API error: ${response.statusText}`)
    }

    const data = await response.json()
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
 */
export async function fetchContinentPolygons(period: string): Promise<any> {
  const age = PERIOD_AGES[period] || 100
  const model = 'SETON2012'

  try {
    const url = `https://gws.gplates.org/reconstruct/static_polygons/?time=${age}&model=${model}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`GPlates API error: ${response.statusText}`)
    }

    const data = await response.json()
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
