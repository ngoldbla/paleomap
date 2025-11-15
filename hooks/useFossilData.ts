'use client'

import { useQuery } from '@tanstack/react-query'
import { PBDBResponse, FossilOccurrence } from '@/lib/types/fossils'
import { PERIOD_AGES } from '@/lib/gplates'

interface UseFossilDataOptions {
  taxon: string
  period: string
  enabled?: boolean
  limit?: number
}

/**
 * Fetch fossil occurrence data from Paleobiology Database
 */
async function fetchFossilOccurrences(
  taxon: string,
  period: string,
  limit: number = 500
): Promise<FossilOccurrence[]> {
  try {
    // Get age range for the period
    const age = PERIOD_AGES[period]
    if (age === undefined) {
      return []
    }

    // Define age range (± margin for period boundaries)
    // For simplicity, we'll use a range around the period age
    const ageRanges: Record<string, { min: number; max: number }> = {
      'Holocene': { min: 0, max: 0.0117 },
      'Pleistocene': { min: 0.0117, max: 2.58 },
      'Pliocene': { min: 2.58, max: 5.33 },
      'Miocene': { min: 5.33, max: 23.03 },
      'Oligocene': { min: 23.03, max: 33.9 },
      'Eocene': { min: 33.9, max: 56.0 },
      'Paleocene': { min: 56.0, max: 66.0 },
      'Cretaceous': { min: 66.0, max: 145.0 },
      'Jurassic': { min: 145.0, max: 201.3 },
      'Triassic': { min: 201.3, max: 251.9 },
      'Permian': { min: 251.9, max: 298.9 },
    }

    const range = ageRanges[period] || { min: age - 10, max: age + 10 }

    const params = new URLSearchParams({
      taxon: taxon,
      min_ma: range.min.toString(),
      max_ma: range.max.toString(),
      limit: limit.toString(),
      show: 'coords,paleoloc,class,phylo',
    })

    const response = await fetch(`/api/paleobiodb/occurrences?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`PBDB API error: ${response.statusText}`)
    }

    const data: PBDBResponse = await response.json()
    return data.records || []
  } catch (error) {
    console.error('Error fetching fossil data:', error)
    return []
  }
}

/**
 * Hook to fetch and cache fossil occurrence data
 */
export function useFossilData({ taxon, period, enabled = true, limit = 500 }: UseFossilDataOptions) {
  return useQuery({
    queryKey: ['fossils', taxon, period, limit],
    queryFn: () => fetchFossilOccurrences(taxon, period, limit),
    enabled: enabled && !!taxon && !!period,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

/**
 * Helper to filter fossils with valid paleocoordinates
 */
export function filterValidCoordinates(fossils: FossilOccurrence[]): FossilOccurrence[] {
  return fossils.filter(
    (fossil) =>
      fossil.paleolat !== undefined &&
      fossil.paleolng !== undefined &&
      !isNaN(fossil.paleolat) &&
      !isNaN(fossil.paleolng)
  )
}
