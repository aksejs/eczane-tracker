import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useGeolocation } from '../hooks/useGeolocation'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from '../config/firebase'
import { Address, isLatLngLiteral } from '../config/types'
import { useAddressCallable } from '@/hooks/useAddressCallable'
import { GeoLocationSensorState } from '@/hooks/useGeolocationSensor'

export interface Location {
  lat: number
  lng: number
}

export const AddressContext = createContext<{
  address?: string
  district?: string
  latLng?: google.maps.LatLngLiteral
  distance?: string
  setDistance: (distanceValue: google.maps.Distance) => void
}>({
  setDistance: () => {},
})

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [distance, setDistance] = useState<string>()
  const { possibleAddress, possibleDistrict, geolocation } =
    useAddressCallable()
  const latLng = useMemo(() => {
    const literal = { lat: geolocation.latitude, lng: geolocation.longitude }
    if (isLatLngLiteral(literal)) {
      return literal
    }
  }, [geolocation.latitude, geolocation.longitude])

  const handleSetDistance = (distanceValue: google.maps.Distance) => {
    setDistance(distanceValue.text)
  }

  return (
    <AddressContext.Provider
      value={{
        address: possibleAddress,
        district: possibleDistrict,
        latLng,
        distance: distance,
        setDistance: handleSetDistance,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
