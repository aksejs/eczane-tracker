import React, { createContext, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@app/utils/firebase'
import { Address, isLatLngLiteral } from '@app/utils/types'
import { useGeolocation } from '@app/hooks/useGeolocation'

export interface Location {
  lat: number
  lng: number
}

const INITIAL_ADDRESS: Address = {
  fullAddress:
    'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul, Turkey',
  district: 'fatih',
}

interface AddressContextProps {
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
}

export const AddressContext = createContext<AddressContextProps>({
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
  const geolocation = useGeolocation()
  const [state, setState] = useState<Address>(INITIAL_ADDRESS)
  const [latLng, setLatLng] = useState<google.maps.LatLngLiteral>()
  const [distance, setDistance] = useState<string>()

  const geocodeAddress = async () => {
    const res = await httpsCallable<
      { lat: number; lng: number },
      google.maps.GeocoderResponse['results']
    >(
      functions,
      'geocodeAddressHttps'
    )({
      lat: geolocation.latitude as number,
      lng: geolocation.longitude as number,
    })

    return res.data[0]
  }

  const { isError, isLoading } = useQuery<
    google.maps.GeocoderResponse['results'][0]
  >('geocodeAddressHttps', geocodeAddress, {
    enabled: !!geolocation.latitude && !!geolocation.longitude,
    onSuccess: (data) =>
      setState({
        fullAddress: data.formatted_address,
        district: data.address_components[3].long_name,
        placeId: data.place_id,
      }),
  })

  const latLngMemo = useMemo(() => {
    const literal = { lat: geolocation.latitude, lng: geolocation.longitude }
    return isLatLngLiteral(literal) ? literal : undefined
  }, [geolocation.latitude, geolocation.longitude])

  const handleSetAddress = (address: Address) => {
    setState(address)
  }

  const handleSetDistance = (distanceValue: google.maps.Distance) => {
    setDistance(distanceValue.text)
  }

  const handleSetLatLng = (literal: google.maps.LatLngLiteral) => {
    setLatLng(literal)
  }

  const addressContextValue: AddressContextProps = {
    address: state,
    latLng: latLng || latLngMemo,
    distance,
    loading: isLoading,
    error: isError,
    geolocationDenied: Boolean(geolocation.error),
    setDistance: handleSetDistance,
    setAddress: handleSetAddress,
    setLatLng: handleSetLatLng,
  }

  return (
    <AddressContext.Provider value={addressContextValue}>
      {children}
    </AddressContext.Provider>
  )
}
