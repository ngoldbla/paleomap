// Client-side cache for paleogeographic data to improve loading performance

interface CacheEntry {
  data: any
  timestamp: number
}

class MapDataCache {
  private cache: Map<string, CacheEntry>
  private maxAge: number // milliseconds

  constructor(maxAge: number = 1000 * 60 * 60 * 24) { // Default 24 hours
    this.cache = new Map()
    this.maxAge = maxAge
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Global singleton cache instance
export const mapDataCache = new MapDataCache()
