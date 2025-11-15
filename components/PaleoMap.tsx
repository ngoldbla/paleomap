'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getPeriodInfo } from '@/lib/gplates'
import { usePaleoGeography } from '@/hooks/usePaleoGeography'
import FossilLayer from './FossilLayer'

interface PaleoMapProps {
  period: string
  selectedTaxa: string[]
  onFossilCountsChange?: (counts: Record<string, number>) => void
}

export default function PaleoMap({ period, selectedTaxa, onFossilCountsChange }: PaleoMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)
  const transitionLayerRef = useRef<L.GeoJSON | null>(null)
  const [fossilCounts, setFossilCounts] = useState<Record<string, number>>({})

  // Use React Query hook for data fetching with caching
  const { data: coastlineData, isLoading, isError, error: queryError } = usePaleoGeography(period)

  // Callback to update fossil counts
  const handleCountChange = useCallback((taxon: string, count: number) => {
    setFossilCounts((prev) => {
      const updated = { ...prev, [taxon]: count }
      onFossilCountsChange?.(updated)
      return updated
    })
  }, [onFossilCountsChange])

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: true,
      })

      // Ocean background - using plain color instead of tiles
      mapRef.current.getContainer().style.backgroundColor = '#4a90e2'
    }
  }, [])

  // Update map when data changes (with smooth transitions)
  useEffect(() => {
    if (!mapRef.current || !coastlineData) return

    if (coastlineData.features && coastlineData.features.length > 0) {
      // Save the old layer for transition
      const oldLayer = geoJsonLayerRef.current

      // Create new GeoJSON layer with initial opacity 0
      const newLayer = L.geoJSON(coastlineData, {
        style: {
          color: '#2c5f2d',
          weight: 1,
          fillColor: '#8fbc8f',
          fillOpacity: 0, // Start invisible
          opacity: 0, // Start invisible
        },
        onEachFeature: (feature, layer) => {
          const periodInfo = getPeriodInfo(period)
          layer.bindPopup(`
            <div style="font-family: sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                ${period} Period
              </h3>
              <p style="margin: 0; font-size: 12px;">
                ${periodInfo.ageText}
              </p>
            </div>
          `)
        }
      }).addTo(mapRef.current)

      // Fit map to bounds of the data
      const bounds = newLayer.getBounds()
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }

      // Smooth transition: fade out old, fade in new
      let progress = 0
      const duration = 500 // 500ms transition
      const steps = 30
      const interval = duration / steps

      const transitionInterval = setInterval(() => {
        progress += 1 / steps

        if (progress >= 1) {
          progress = 1
          clearInterval(transitionInterval)

          // Remove old layer after transition completes
          if (oldLayer && mapRef.current) {
            mapRef.current.removeLayer(oldLayer)
          }
        }

        // Fade out old layer
        if (oldLayer) {
          oldLayer.setStyle({
            fillOpacity: 0.7 * (1 - progress),
            opacity: 1 * (1 - progress)
          })
        }

        // Fade in new layer
        newLayer.setStyle({
          fillOpacity: 0.7 * progress,
          opacity: 1 * progress
        })
      }, interval)

      // Update reference to current layer
      geoJsonLayerRef.current = newLayer

      return () => {
        clearInterval(transitionInterval)
      }
    }
  }, [coastlineData, period])

  // Cleanup map on component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const periodInfo = getPeriodInfo(period)

  return (
    <div className="absolute inset-0">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Render fossil layers for selected taxa */}
      {mapRef.current &&
        selectedTaxa.map((taxon) => (
          <FossilLayer
            key={taxon}
            map={mapRef.current!}
            taxon={taxon}
            period={period}
            onCountChange={handleCountChange}
          />
        ))}

      {/* Status overlay */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
        <h3 className="font-semibold text-sm mb-1">Map Status</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Displaying: <span className="font-semibold">{period}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {periodInfo.ageText}
        </p>

        {isLoading && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Loading paleogeographic data...
          </p>
        )}

        {isError && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            {queryError?.message || 'Failed to load map data'}
          </p>
        )}

        {!isLoading && !isError && coastlineData && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            ✓ Cached data loaded instantly
          </p>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Data source: GPlates Web Service
        </p>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded shadow z-[1000]">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Paleomap data from <a
            href="https://www.gplates.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GPlates
          </a>
        </p>
      </div>
    </div>
  )
}
