import React, { createContext, useContext, useEffect, useState } from 'react'
import { Address } from '@app/utils/types'
import { useGeolocation } from '@app/hooks/useGeolocation'
import { INITIAL_ADDRESS } from '@app/utils/contants'
import { geocodeAddress } from '@app/utils/api'

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

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const geolocation = useGeolocation()
  const [state, setState] = useState<Address>()

  useEffect(() => {
    if (geolocation.latitude) {
      geocodeAddress({
        latlng: `${geolocation.latitude},${geolocation.longitude}`,
      }).then((data) => {
        setState({
          fullAddress: data.fullAddress,
          city: data.city,
          district: data.district,
          placeId: data.placeId,
          location: data.location,
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
