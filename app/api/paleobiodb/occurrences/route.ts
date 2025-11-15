import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy for Paleobiology Database API to avoid CORS issues
 * API Documentation: https://paleobiodb.org/data1.2/
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const taxon = searchParams.get('taxon') || 'Dinosauria'
  const interval = searchParams.get('interval') || ''
  const minMa = searchParams.get('min_ma')
  const maxMa = searchParams.get('max_ma')
  const limit = searchParams.get('limit') || '500'
  const show = searchParams.get('show') || 'coords,paleoloc,class,phylo'

  try {
    // Build PBDB API URL
    const params = new URLSearchParams({
      base_name: taxon,
      show: show,
      limit: limit,
    })

    // Add time constraints
    if (interval) {
      params.append('interval', interval)
    } else if (minMa && maxMa) {
      params.append('min_ma', minMa)
      params.append('max_ma', maxMa)
    }

    const pbdbUrl = `https://paleobiodb.org/data1.2/occs/list.json?${params.toString()}`

    const response = await fetch(pbdbUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`PBDB API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Cache for 1 hour (fossil data is static)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching from PBDB:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fossil data' },
      { status: 500 }
    )
  }
}
