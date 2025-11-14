'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import TimePeriodSelector from '@/components/TimePeriodSelector'
import TimelineAnimation from '@/components/TimelineAnimation'

// Dynamically import the map component to avoid SSR issues with Leaflet
const PaleoMap = dynamic(() => import('@/components/PaleoMap'), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center">Loading map...</div>
})

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState('Permian')

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">PaleoMap Viewer</h1>
        <p className="text-blue-100">
          Explore continental drift from Pangea to present day
        </p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="lg:w-80 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
          <TimelineAnimation
            currentPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          <div className="mt-6">
            <TimePeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>

          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This interactive map shows how Earth's continents have shifted over geological time periods,
              from the supercontinent Pangea to their present-day positions.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Use the animation controls above to watch continental drift unfold, or select a specific
              time period to explore.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Currently Viewing
            </h3>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {selectedPeriod}
            </p>
          </div>
        </aside>

        <div className="flex-1 relative">
          <PaleoMap period={selectedPeriod} />
        </div>
      </div>
    </main>
  )
}
