import React, { createContext, useEffect, useState } from 'react'
import Geocode from 'react-geocode'

import { useGeolocation, usePersistStore } from './hooks'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { getFunctions } from 'firebase/functions'
import { app } from './firebase'

export interface Location {
  lat: number
  lng: number
}

export const AddressContext = createContext<{
  address?: string
  location?: Location
}>({ address: '' })

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [addressCache, setAddressCache] = usePersistStore('address', {
    address: '',
    location: '',
  })
  const { currentLocation } = useGeolocation()
  const [addressLocal, setAddress] = useState('')
  const [executeCallable, loading, error] = useHttpsCallable<any, any>(
    getFunctions(app, 'europe-west1'),
    'geocodeAddressHttps'
  )
  const [location, setLocation] = useState<GeolocationPosition>()

  const setContextAddress = (address: string) => {
    setAddress(address)
    setAddressCache({ ...addressCache, address })
  }

  const setContextLocation = (location: GeolocationPosition) => {
    setLocation(location)
    setAddressCache({
      ...addressCache,
      location: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    })
  }

  useEffect(() => {
    if (!currentLocation) {
      return
    }

    executeCallable({
      lat: currentLocation.coords.latitude,
      lng: currentLocation.coords.longitude,
    })
  }, [currentLocation])

  return (
    <AddressContext.Provider
      value={{
        address: addressLocal,
        location: currentLocation
          ? {
              lat: currentLocation.coords.latitude,
              lng: currentLocation.coords.longitude,
            }
          : undefined,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
