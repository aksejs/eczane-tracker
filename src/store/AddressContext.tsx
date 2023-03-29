import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useGeolocation } from '../hooks/useGeolocation'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from '../config/firebase'
import { isLatLngLiteral } from '../config/types'
import { useAddressCallable } from '@/hooks/useAddressCallable'
import { GeoLocationSensorState } from '@/hooks/useGeolocationSensor'

export interface Location {
  lat: number
  lng: number
}

interface Address {
  fullAddress?: string
  placeId?: string
  district?: string
}

export const AddressContext = createContext<{
  address?: Address
  latLng?: google.maps.LatLngLiteral
  distance?: string
  setDistance: (distanceValue: google.maps.Distance) => void
  setAddress: (address: {
    latLng?: google.maps.LatLngLiteral
    fullAddress?: string
    district?: string
  }) => void
  setLatLng: (literal: google.maps.LatLngLiteral) => void
}>({
  setDistance: () => {},
  setAddress: () => {},
  setLatLng: () => {},
})

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { possibleAddress, possibleDistrict, geolocation } =
    useAddressCallable()
  const [state, setState] = useState<Address>()
  const [latLng, setLatLng] = useState<google.maps.LatLngLiteral>()
  const [distance, setDistance] = useState<string>()

  const latLngMemo = useMemo(() => {
    const literal = { lat: geolocation.latitude, lng: geolocation.longitude }
    if (isLatLngLiteral(literal)) {
      return literal
    }
  }, [geolocation.latitude, geolocation.longitude])

  const handleSetAddress = (address: {
    latLng?: google.maps.LatLngLiteral
    fullAddress?: string
    district?: string
  }) => {
    setState((oldState) => ({ ...oldState, ...address }))
  }

  const handleSetDistance = (distanceValue: google.maps.Distance) => {
    setDistance(distanceValue.text)
  }

  const handleSetLatLng = (literal: google.maps.LatLngLiteral) => {
    setLatLng(literal)
  }

  const address: Address = useMemo(
    () => ({
      fullAddress: state?.fullAddress || possibleAddress,
      district: state?.district || possibleDistrict,
    }),
    [state, possibleAddress, possibleDistrict]
  )

  return (
    <AddressContext.Provider
      value={{
        address: address,
        latLng: latLng || latLngMemo,
        distance: distance,
        setDistance: handleSetDistance,
        setAddress: handleSetAddress,
        setLatLng: handleSetLatLng,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
