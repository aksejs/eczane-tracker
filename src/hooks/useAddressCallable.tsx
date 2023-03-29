import { useEffect, useState } from 'react'
import { useHttpsCallable } from 'react-firebase-hooks/functions'

import { functions } from '@app/config/firebase'
import { Address } from '@app/config/types'

import { useGeolocationSensor } from './useGeolocationSensor'

export function useAddressCallable() {
  const geolocation = useGeolocationSensor()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [address, setAddress] = useState<Address>()
  const [executeCallable, callableLoading, callableError] = useHttpsCallable<
    { lat: number; lng: number },
    google.maps.GeocoderResponse['results']
  >(functions, 'geocodeAddressHttps')

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      executeCallable({
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      })
        .then((res) => {
          if (res) {
            setAddress({
              fullAddress: res.data[0].formatted_address,
              district: res.data[0].address_components[3].long_name,
              placeId: res.data[0].place_id,
            })
            setIsLoading(false)
            setIsError(false)
          }
        })
        .catch(() => {
          setIsLoading(false)
          setIsError(true)
        })
    }
  }, [geolocation.latitude, geolocation.longitude])

  return {
    possibleAddress: address,
    loading: isLoading,
    error: isError,
    geolocation,
  }
}
