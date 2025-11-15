'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPaleoGeography, PERIOD_AGES } from '@/lib/gplates'
import { useEffect } from 'react'

/**
 * Hook to fetch and cache paleogeography data with React Query
 * Implements automatic caching, prefetching, and performance optimizations
 */
export function usePaleoGeography(period: string) {
  const queryClient = useQueryClient()

  // Main query for current period
  const query = useQuery({
    queryKey: ['paleogeography', period],
    queryFn: () => fetchPaleoGeography(period),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  return query
}

/**
 * Hook to prefetch adjacent periods for smooth animation
 * Prefetches next and optionally previous period
 */
export function usePrefetchAdjacentPeriods(
  currentPeriod: string,
  isPlaying: boolean = false
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isPlaying) return

    const periods = Object.keys(PERIOD_AGES)
    const currentIndex = periods.indexOf(currentPeriod)

    if (currentIndex === -1) return

    // Prefetch next period
    const nextIndex = (currentIndex + 1) % periods.length
    const nextPeriod = periods[nextIndex]

    queryClient.prefetchQuery({
      queryKey: ['paleogeography', nextPeriod],
      queryFn: () => fetchPaleoGeography(nextPeriod),
      staleTime: 1000 * 60 * 60,
    })

    // Also prefetch the period after next for extra smoothness
    const nextNextIndex = (currentIndex + 2) % periods.length
    const nextNextPeriod = periods[nextNextIndex]

    queryClient.prefetchQuery({
      queryKey: ['paleogeography', nextNextPeriod],
      queryFn: () => fetchPaleoGeography(nextNextPeriod),
      staleTime: 1000 * 60 * 60,
    })
  }, [currentPeriod, isPlaying, queryClient])
}

/**
 * Hook to get fetch timing information for adaptive animation
 */
export function useFetchTiming(period: string) {
  const query = usePaleoGeography(period)

  return {
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    fetchStatus: query.fetchStatus,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
