import { useEffect, useState } from 'react'

interface UseGeolocation {
  currentLocation?: GeolocationPosition['coords']
  isDisabled: boolean
}

// todo
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
