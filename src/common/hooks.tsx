import React, { useEffect, useState } from 'react'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import browserStorage from 'store'
import { functions } from './firebase'

interface UseGeolocation {
  currentLocation?: GeolocationPosition['coords']
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
    currentLocation: location?.coords,
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
