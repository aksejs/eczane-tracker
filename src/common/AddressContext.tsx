import React, { createContext, useEffect, useState } from 'react'
import Geocode from 'react-geocode'

import { useGeolocation, usePersistStore } from './hooks'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app, functions } from './firebase'
import { Address, Prediction } from './types'
import axios from 'axios'

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
