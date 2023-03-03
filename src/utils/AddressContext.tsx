import React, { createContext, useEffect, useState } from 'react'
import Geocode from 'react-geocode'

import { useGeolocation, usePersistStore } from './hooks'

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

    Geocode.fromLatLng(
      currentLocation.coords.latitude.toString(),
      currentLocation.coords.longitude.toString()
    ).then(
      (response) => {
        const address = response.results[0].formatted_address
        setContextAddress(address)
        setContextLocation(currentLocation)
      },
      (error) => {
        console.error(error)
      }
    )
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
