import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const time = searchParams.get('time')
    const model = searchParams.get('model') || 'SETON2012'

    if (!time) {
      return NextResponse.json(
        { error: 'Missing required parameter: time' },
        { status: 400 }
      )
    }

    // Proxy request to GPlates API
    const gplatesUrl = `https://gws.gplates.org/reconstruct/static_polygons/?time=${time}&model=${model}`

    const response = await fetch(gplatesUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`GPlates API returned status ${response.status}`)
    }

    const data = await response.json()

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error proxying GPlates polygons request:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch from GPlates API',
        type: 'FeatureCollection',
        features: []
      },
      { status: 500 }
    )
  }
}
