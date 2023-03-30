import { FunctionComponent, useContext } from 'react'
import _, { add } from 'lodash'

import { AddressContext } from '@app/store/AddressContext'
import { Pharmacies } from '@app/components/Phamracies'
import { AddressField, PageWrapper, Loader } from '@app/components'

export const MainPage: FunctionComponent = () => {
  const { address, latLng, distance, loading, error } =
    useContext(AddressContext)

  if (loading || !address) {
    return (
      <PageWrapper>
        <Loader>Loading...</Loader>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <AddressField defaultAddress={address} />
      {latLng && (
        <Pharmacies address={address} location={latLng} distance={distance} />
      )}
    </PageWrapper>
  )
}
