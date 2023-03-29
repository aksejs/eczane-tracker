import { FunctionComponent, useContext } from 'react'
import _ from 'lodash'

import { AddressContext } from '@app/store/AddressContext'
import { Pharmacies } from '@app/components/Phamracies'
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
        <Pharmacies address={address} location={latLng} distance={distance} />
      )}
    </PageWrapper>
  )
}
