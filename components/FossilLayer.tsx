'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useFossilData, filterValidCoordinates } from '@/hooks/useFossilData'
import { TAXON_GROUPS } from '@/lib/types/fossils'

interface FossilLayerProps {
  map: L.Map
  taxon: string
  period: string
  onCountChange?: (taxon: string, count: number) => void
}

export default function FossilLayer({ map, taxon, period, onCountChange }: FossilLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  // Fetch fossil data for this taxon
  const { data: fossils, isLoading } = useFossilData({
    taxon,
    period,
    enabled: true,
    limit: 500,
  })

  useEffect(() => {
    if (!map) return

    // Create layer group if it doesn't exist
    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map)
    }

    const layerGroup = layerGroupRef.current

    // Clear existing markers
    layerGroup.clearLayers()

    if (!fossils || fossils.length === 0) {
      onCountChange?.(taxon, 0)
      return
    }

    // Filter fossils with valid paleocoordinates
    const validFossils = filterValidCoordinates(fossils)
    onCountChange?.(taxon, validFossils.length)

    // Get color for this taxon
    const taxonGroup = TAXON_GROUPS.find((g) => g.name === taxon)
    const color = taxonGroup?.color || '#3498db'

    // Add markers for each fossil occurrence
    validFossils.forEach((fossil) => {
      if (fossil.paleolat === undefined || fossil.paleolng === undefined) return

      // Create circle marker
      const marker = L.circleMarker([fossil.paleolat, fossil.paleolng], {
        radius: 5,
        fillColor: color,
        color: '#fff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6,
      })

      // Add popup with fossil information
      const popupContent = `
        <div style="font-family: sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: ${color};">
            ${taxonGroup?.label || taxon}
          </h3>
          <div style="font-size: 12px; line-height: 1.5;">
            <strong>Species:</strong> ${fossil.tna || 'Unknown'}<br>
            ${fossil.fml ? `<strong>Family:</strong> ${fossil.fml}<br>` : ''}
            ${fossil.odl ? `<strong>Order:</strong> ${fossil.odl}<br>` : ''}
            ${fossil.cll ? `<strong>Class:</strong> ${fossil.cll}<br>` : ''}
            ${fossil.eag !== undefined && fossil.lag !== undefined
              ? `<strong>Age:</strong> ${fossil.eag.toFixed(1)} - ${fossil.lag.toFixed(1)} Ma<br>`
              : ''
            }
            ${fossil.cc2 ? `<strong>Location:</strong> ${fossil.cc2}` : ''}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      marker.addTo(layerGroup)
    })

    return () => {
      // Cleanup when component unmounts or taxon changes
      layerGroup.clearLayers()
    }
  }, [map, fossils, taxon, onCountChange])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (layerGroupRef.current && map) {
        map.removeLayer(layerGroupRef.current)
        layerGroupRef.current = null
      }
    }
  }, [map])

  return null // This is a logical component, no UI
}
