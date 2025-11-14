'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchPaleoGeography, fetchContinentPolygons, getPeriodInfo } from '@/lib/gplates'

interface PaleoMapProps {
  period: string
}

export default function PaleoMap({ period }: PaleoMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    // Load and display paleogeographic data
    async function loadPaleoData() {
      if (!mapRef.current) return

      setLoading(true)
      setError(null)

      try {
        // Remove previous GeoJSON layer if exists
        if (geoJsonLayerRef.current) {
          mapRef.current?.removeLayer(geoJsonLayerRef.current)
        }

        // Fetch coastline data from GPlates
        const coastlineData = await fetchPaleoGeography(period)

        if (coastlineData.features && coastlineData.features.length > 0) {
          // Create GeoJSON layer with styling
          geoJsonLayerRef.current = L.geoJSON(coastlineData, {
            style: {
              color: '#2c5f2d',
              weight: 1,
              fillColor: '#8fbc8f',
              fillOpacity: 0.7
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
          const bounds = geoJsonLayerRef.current.getBounds()
          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] })
          }
        } else {
          setError('No paleogeographic data available for this period')
        }
      } catch (err) {
        console.error('Error loading paleogeographic data:', err)
        setError('Failed to load map data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadPaleoData()

    return () => {
      // Cleanup on unmount
      if (geoJsonLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(geoJsonLayerRef.current)
      }
    }
  }, [period])

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

      {/* Status overlay */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
        <h3 className="font-semibold text-sm mb-1">Map Status</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Displaying: <span className="font-semibold">{period}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {periodInfo.ageText}
        </p>

        {loading && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Loading paleogeographic data...
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            {error}
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
