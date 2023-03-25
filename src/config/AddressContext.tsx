import React, { createContext, useEffect, useState } from 'react'

import { useGeolocation } from '../hooks/useGeolocation'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from './firebase'
import { Address } from './types'

export interface Location {
  lat: number
  lng: number
}

export const AddressContext = createContext<{
  address?: Address
  location?: GeolocationPosition['coords']
  setAddress: (address: Address) => void
}>({ setAddress: () => {} })

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { currentLocation } = useGeolocation()
  const [currentAddress, setAddress] = useState<Address>()
  const [executeCallable] = useHttpsCallable<any, any>(
    functions,
    'geocodeAddressHttps'
  )

  useEffect(() => {
    if (!currentLocation) {
      return
    }

    executeCallable({
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    }).then((res) => {
      setAddress({
        fullAddress: res?.data[0].formatted_address,
        district: res?.data[0].address_components[3].long_name,
      })
    })
  }, [currentLocation])

  return (
    <AddressContext.Provider
      value={{
        address: currentAddress,
        location: currentLocation,
        setAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
