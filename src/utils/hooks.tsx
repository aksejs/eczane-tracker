import React, { useEffect, useState } from 'react'
import browserStorage from 'store'

interface UseGeolocation {
  location?: GeolocationPosition
  isDisabled: boolean
}

export function useGeolocation(): UseGeolocation {
  const [location, setLocation] = useState<GeolocationPosition>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position)
      },
      () => setIsError(true)
    )
  }, [])

  return {
    location: location,
    isDisabled: isError,
  }
}

export const usePersistStore = (storageKey: string, initialState: any) => {
  const [state, setInternalState] = useState(initialState)

  useEffect(() => {
    const storageInBrowser = browserStorage.get(storageKey)

    if (storageInBrowser) {
      setInternalState(storageInBrowser)
    }
  }, [])

  const setState = (newState: any) => {
    browserStorage.set(storageKey, newState)
    setInternalState(newState)
  }

  return [state, setState]
}
