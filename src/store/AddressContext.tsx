import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useGeolocation } from '@app/hooks/useGeolocation'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { functions } from '@app/config/firebase'
import { Address, isLatLngLiteral } from '@app/config/types'
import { useAddressCallable } from '@app/hooks/useAddressCallable'
import { GeoLocationSensorState } from '@app/hooks/useGeolocationSensor'

export interface Location {
  lat: number
  lng: number
}

export const AddressContext = createContext<{
  address?: Address
  latLng?: google.maps.LatLngLiteral
  distance?: string
  loading: boolean
  error: boolean
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
  loading: true,
  error: false,
})

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { possibleAddress, geolocation, loading, error } = useAddressCallable()
  const [state, setState] = useState<Address>()
  const [latLng, setLatLng] = useState<google.maps.LatLngLiteral>()
  const [distance, setDistance] = useState<string>()

  console.log(loading)

  const latLngMemo = useMemo(() => {
    const literal = { lat: geolocation.latitude, lng: geolocation.longitude }
    if (isLatLngLiteral(literal)) {
      return literal
    }
  }, [geolocation.latitude, geolocation.longitude])

  const handleSetAddress = (address: Address) => {
    setState((oldState) => ({ ...oldState, ...address }))
  }

  const handleSetDistance = (distanceValue: google.maps.Distance) => {
    setDistance(distanceValue.text)
  }

  const handleSetLatLng = (literal: google.maps.LatLngLiteral) => {
    setLatLng(literal)
  }

  const address: Address | undefined = useMemo(() => {
    if (state) {
      return {
        fullAddress: state.fullAddress,
        district: state.district,
        placeId: state.placeId,
      }
    }

    if (possibleAddress) {
      return {
        fullAddress: possibleAddress.fullAddress,
        district: possibleAddress.district,
        placeId: possibleAddress.placeId,
      }
    }
  }, [state, possibleAddress])

  return (
    <AddressContext.Provider
      value={{
        address: address,
        latLng: latLng || latLngMemo,
        distance: distance,
        loading,
        error,
        setDistance: handleSetDistance,
        setAddress: handleSetAddress,
        setLatLng: handleSetLatLng,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
