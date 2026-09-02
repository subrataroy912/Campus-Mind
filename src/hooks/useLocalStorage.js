import { useCallback, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })
  const updateValue = useCallback((nextValue) => {
    setValue((current) => {
      const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue
      localStorage.setItem(key, JSON.stringify(resolved))
      return resolved
    })
  }, [key])
  return [value, updateValue]
}
