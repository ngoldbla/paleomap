'use client'

import { useState, useEffect } from 'react'
import { MAJOR_PERIODS } from '@/lib/periods'
import { fetchPaleoGeography } from '@/lib/gplates'

interface TimelineAnimationProps {
  currentPeriod: string
  onPeriodChange: (period: string) => void
}

export default function TimelineAnimation({
  currentPeriod,
  onPeriodChange
}: TimelineAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2000) // milliseconds per period

  // Preload adjacent periods in the background for smoother animation
  useEffect(() => {
    const currentIndex = MAJOR_PERIODS.indexOf(currentPeriod)
    if (currentIndex === -1) return

    // Preload next 2 periods
    const preloadPeriods = [
      MAJOR_PERIODS[(currentIndex + 1) % MAJOR_PERIODS.length],
      MAJOR_PERIODS[(currentIndex + 2) % MAJOR_PERIODS.length]
    ]

    preloadPeriods.forEach(period => {
      // Fire and forget - this will cache the data for later use
      fetchPaleoGeography(period).catch(err => {
        console.log(`Background preload failed for ${period}:`, err)
      })
    })
  }, [currentPeriod])

  useEffect(() => {
    if (!isPlaying) return

    const currentIndex = MAJOR_PERIODS.indexOf(currentPeriod)
    if (currentIndex === -1) return

    const timer = setTimeout(() => {
      // Move to next period, or loop back to start
      const nextIndex = (currentIndex + 1) % MAJOR_PERIODS.length
      onPeriodChange(MAJOR_PERIODS[nextIndex])
    }, speed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentPeriod, speed, onPeriodChange])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    onPeriodChange(MAJOR_PERIODS[0])
  }

  const currentIndex = MAJOR_PERIODS.indexOf(currentPeriod)
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / MAJOR_PERIODS.length) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
      <h3 className="font-semibold text-sm mb-2">Continental Drift Animation</h3>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ↺ Reset
        </button>
      </div>

      {/* Speed control */}
      <div className="space-y-2">
        <label className="text-xs text-gray-600 dark:text-gray-300 block">
          Animation Speed
        </label>
        <input
          type="range"
          min="500"
          max="5000"
          step="500"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {(speed / 1000).toFixed(1)}s per period
        </div>
      </div>

      {/* Timeline indicator */}
      <div className="text-xs text-gray-600 dark:text-gray-300">
        Period {currentIndex + 1} of {MAJOR_PERIODS.length}
      </div>
    </div>
  )
}
