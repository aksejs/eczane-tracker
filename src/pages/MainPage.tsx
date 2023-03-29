import { FunctionComponent, ReactNode, useContext } from 'react'
import _ from 'lodash'

import { AddressContext } from '@app/store/AddressContext'
import { PharmaciesMap } from '@app/features/PharmaciesMap'
import { AddressField, PageWrapper } from '@app/components'

export const MainPage: FunctionComponent = () => {
  const { address, latLng, distance, loading, error } =
    useContext(AddressContext)

  if (loading) {
    return <PageWrapper>Loading...</PageWrapper>
  }

  if (error) {
    return <PageWrapper>Error</PageWrapper>
  }

  return (
    <PageWrapper>
      {address?.fullAddress && address.district && (
        <AddressField defaultAddress={address} />
      )}
      {latLng && (
        <PharmaciesMap
          address={address}
          location={latLng}
          distance={distance}
        />
      )}
    </PageWrapper>
  )
}
