import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQuery } from 'react-query'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@app/utils/firebase'
import { Address, ApiGeocodeResponse, isLatLngLiteral } from '@app/utils/types'
import {
  GeoLocationSensorState,
  useGeolocation,
} from '@app/hooks/useGeolocation'
import { INITIAL_ADDRESS } from '@app/utils/contants'

interface AddressContextProps {
  address?: Address
  loading: boolean
  error: boolean
  geolocationDenied: boolean
  setAddress: (address: Address) => void
}

export const AddressContext = createContext<AddressContextProps>({
  setAddress: () => {},
  loading: true,
  error: false,
  geolocationDenied: false,
})

const geocodeAddress = async (geolocation: GeoLocationSensorState) => {
  const res = await httpsCallable<{ latlng: string }, ApiGeocodeResponse>(
    functions,
    'geocodeAddressHttps'
  )({
    latlng: `${geolocation.latitude},${geolocation.longitude}`,
  })

  return res
}

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const geolocation = useGeolocation()
  const [state, setState] = useState<Address>()

  useEffect(() => {
    if (geolocation.latitude) {
      geocodeAddress(geolocation).then((res) => {
        setState({
          fullAddress: res.data.fullAddress,
          city: res.data.city,
          district: res.data.district,
          placeId: res.data.placeId,
          location: res.data.location,
        })
      })
    }
  }, [geolocation.latitude])

  useEffect(() => {
    if (geolocation.denied) {
      setState(INITIAL_ADDRESS)
    }
  }, [geolocation.denied])

  const handleSetAddress = (address: Address) => {
    setState(address)
  }

  const addressContextValue: AddressContextProps = {
    address: state,
    loading: geolocation.loading || false,
    error: false,
    geolocationDenied: Boolean(geolocation.error),
    setAddress: handleSetAddress,
  }

  return (
    <AddressContext.Provider value={addressContextValue}>
      {children}
    </AddressContext.Provider>
  )
}

export const useAddressContext = () => useContext(AddressContext)
