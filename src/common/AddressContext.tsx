import React, { createContext, useEffect, useState } from 'react'
import Geocode from 'react-geocode'

import { useGeolocation, usePersistStore } from './hooks'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app, functions } from './firebase'
import { Prediction } from './types'
import axios from 'axios'

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
    functions,
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

  const getGeocode = async ({ lat, lng }: { lat: string; lng: string }) => {
    const some = await executeCallable({ lat, lng })

    console.log(some)
  }

  useEffect(() => {
    if (!currentLocation) {
      return
    }

    getGeocode({
      lat: currentLocation.coords.latitude.toString(),
      lng: currentLocation.coords.longitude.toString(),
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
