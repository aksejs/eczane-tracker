import React, { createContext, useMemo, useState } from 'react'

import { Address, isLatLngLiteral } from '@app/utils/types'
import { useAddressCallable } from '@app/hooks/useAddressCallable'

export interface Location {
  lat: number
  lng: number
}

const INITIAL_ADDRESS: Address = {
  fullAddress:
    'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey',
  district: 'fatih',
}

export const AddressContext = createContext<{
  address?: Address
  latLng?: google.maps.LatLngLiteral
  distance?: string
  loading: boolean
  error: boolean
  geolocationDenied: boolean
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
  geolocationDenied: false,
})

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { possibleAddress, geolocation, loading, error, geolocationDenied } =
    useAddressCallable()
  const [state, setState] = useState<Address>(INITIAL_ADDRESS)
  const [latLng, setLatLng] = useState<google.maps.LatLngLiteral>()
  const [distance, setDistance] = useState<string>()

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
    if (possibleAddress) {
      return {
        fullAddress: possibleAddress.fullAddress,
        district: possibleAddress.district,
        placeId: possibleAddress.placeId,
      }
    }

    return {
      fullAddress: state.fullAddress,
      district: state.district,
      placeId: state.placeId,
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
        geolocationDenied,
        setDistance: handleSetDistance,
        setAddress: handleSetAddress,
        setLatLng: handleSetLatLng,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
