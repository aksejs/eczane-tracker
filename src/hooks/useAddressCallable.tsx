import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { useGeolocationSensor } from './useGeolocationSensor'
import { functions } from '@/config/firebase'
import { useEffect, useState } from 'react'
import { Address } from '@/config/types'

export function useAddressCallable() {
  const geolocation = useGeolocationSensor()
  const [address, setAddress] = useState<Address>()
  const [executeCallable, callableLoading, callableError] = useHttpsCallable(
    functions,
    'geocodeAddressHttps'
  )

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      executeCallable({
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      }).then((res: any) => {
        setAddress({
          fullAddress: res?.data[0].formatted_address,
          district: res?.data[0].address_components[3].long_name,
        })
      })
    }
  }, [geolocation.latitude, geolocation.longitude])

  return {
    possibleAddress: address?.fullAddress,
    possibleDistrict: address?.district,
    loading: callableLoading,
    error: callableError,
    geolocation,
  }
}
