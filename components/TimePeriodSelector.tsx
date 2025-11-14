'use client'

import { GEOLOGICAL_PERIODS } from '@/lib/periods'

interface TimePeriodSelectorProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}

export default function TimePeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: TimePeriodSelectorProps) {
  const selectedInfo = GEOLOGICAL_PERIODS.find(p => p.name === selectedPeriod)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Time Periods</h2>

      <div className="space-y-2">
        {GEOLOGICAL_PERIODS.map((period) => (
          <button
            key={period.name}
            onClick={() => onPeriodChange(period.name)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              selectedPeriod === period.name
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="font-semibold">{period.name}</div>
            <div className={`text-sm ${
              selectedPeriod === period.name ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {period.era} Era
            </div>
            <div className={`text-xs ${
              selectedPeriod === period.name ? 'text-blue-200' : 'text-gray-400'
            }`}>
              {period.ageStart} - {period.ageEnd} Ma
            </div>
          </button>
        ))}
      </div>

      {selectedInfo && (
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            {selectedInfo.name} Period
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {selectedInfo.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {selectedInfo.ageStart} to {selectedInfo.ageEnd} million years ago
          </p>
        </div>
      )}
    </div>
  )
}
