import { useQuery } from 'react-query'
import { GoogleMap, Loader } from '@app/components'
import { BottomSheet } from '../BottomSheet'
import { Address } from '@app/utils/types'
import { fetchPharmaciesByAddress } from '@app/utils/api'

export default function PharmaciesMap({ address }: { address: Address }) {
  const {
    data: pharmacies,
    isLoading,
    isError,
  } = useQuery(
    ['pharmacies', address.location.lat, address.location.lng],
    () => fetchPharmaciesByAddress(address),
    {
      enabled: !!address.location.lat && !!address.location.lng,
      staleTime: 1000 * 60 * 60,
      cacheTime: 1000 * 60 * 60,
    }
  )

  if (isLoading) {
    return <Loader />
  }

  if (isError || !pharmacies) {
    return <div>Error loading pharmacies.</div>
  }

  return (
    <>
      <GoogleMap
        latLng={address.location}
        markers={pharmacies}
        onMarkerClick={() => {}}
      />
      {pharmacies.length > 0 && <BottomSheet pharmacies={pharmacies} />}
    </>
  )
}
