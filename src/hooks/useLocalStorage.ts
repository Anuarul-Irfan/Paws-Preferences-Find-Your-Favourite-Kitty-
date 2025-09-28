import { useState, useEffect, useCallback, useRef } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)
  const storedValueRef = useRef<T>(initialValue)

  // Custom serialization for Sets
  const serialize = (value: T): string => {
    if (value instanceof Set) {
      return JSON.stringify(Array.from(value))
    }
    return JSON.stringify(value)
  }

  // Custom deserialization for Sets
  const deserialize = (value: string, initialValue: T): T => {
    try {
      const parsed = JSON.parse(value)
      if (initialValue instanceof Set && Array.isArray(parsed)) {
        return new Set(parsed) as T
      }
      return parsed
    } catch {
      return initialValue
    }
  }

  useEffect(() => {
    setIsClient(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedValue = deserialize(item, initialValue)
        setStoredValue(parsedValue)
        storedValueRef.current = parsedValue
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]) // Only depend on key, not initialValue to avoid infinite loops

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValueRef.current) : value
      setStoredValue(valueToStore)
      storedValueRef.current = valueToStore
      if (isClient) {
        window.localStorage.setItem(key, serialize(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [isClient, key, serialize])

  return [storedValue, setValue] as const
}

const initialUsedCatIds = new Set<string>()

export const useUsedCatIds = () => {
  const [usedCatIds, setUsedCatIds] = useLocalStorage<Set<string>>(
    STORAGE_KEYS.USED_CAT_IDS,
    initialUsedCatIds
  )

  const markCatAsUsed = useCallback((id: string) => {
    setUsedCatIds(prev => {
      // Ensure prev is a Set, fallback to empty Set if not
      const prevSet = prev instanceof Set ? prev : new Set<string>()
      return new Set([...prevSet, id])
    })
  }, [setUsedCatIds])

  const isCatUsed = useCallback((id: string) => {
    return usedCatIds instanceof Set ? usedCatIds.has(id) : false
  }, [usedCatIds])

  const clearUsedCats = useCallback(() => {
    setUsedCatIds(new Set<string>())
  }, [setUsedCatIds])

  return {
    usedCatIds,
    markCatAsUsed,
    isCatUsed,
    clearUsedCats
  }
}
