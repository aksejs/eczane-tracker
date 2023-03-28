import React, { createContext, useEffect, useMemo, useState } from 'react'

import { useGeolocation } from '../hooks/useGeolocation'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from '../config/firebase'
import { Address } from '../config/types'
import { useAddressCallable } from '@/hooks/useAddressCallable'
import { GeoLocationSensorState } from '@/hooks/useGeolocationSensor'

export interface Location {
  lat: number
  lng: number
}

export const AddressContext = createContext<{
  possibleAddress?: string
  possibleDistrict?: string
  geolocation?: GeoLocationSensorState
}>({})

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { possibleAddress, possibleDistrict, geolocation } =
    useAddressCallable()

  return (
    <AddressContext.Provider
      value={{
        possibleAddress,
        possibleDistrict,
        geolocation,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
