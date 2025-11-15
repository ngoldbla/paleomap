'use client'

import { TAXON_GROUPS } from '@/lib/types/fossils'

interface FossilControlsProps {
  selectedTaxa: string[]
  onTaxaChange: (taxa: string[]) => void
  fossilCounts: Record<string, number>
}

export default function FossilControls({
  selectedTaxa,
  onTaxaChange,
  fossilCounts,
}: FossilControlsProps) {
  const handleTaxonToggle = (taxonName: string) => {
    if (selectedTaxa.includes(taxonName)) {
      onTaxaChange(selectedTaxa.filter((t) => t !== taxonName))
    } else {
      onTaxaChange([...selectedTaxa, taxonName])
    }
  }

  const totalFossils = Object.values(fossilCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Fossil Overlay</h3>
        {totalFossils > 0 && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {totalFossils} occurrences
          </span>
        )}
      </div>

      <div className="space-y-2">
        {TAXON_GROUPS.map((group) => {
          const isSelected = selectedTaxa.includes(group.name)
          const count = fossilCounts[group.name] || 0

          return (
            <label
              key={group.name}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleTaxonToggle(group.name)}
                className="w-4 h-4 rounded"
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {group.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {group.description}
                </div>
              </div>
              {isSelected && count > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              )}
            </label>
          )
        })}
      </div>

      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Data from Paleobiology Database
        </p>
      </div>
    </div>
  )
}
