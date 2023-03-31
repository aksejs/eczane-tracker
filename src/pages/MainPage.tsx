import { FunctionComponent, useContext } from 'react'
import _, { add } from 'lodash'

import { AddressContext } from '@app/store/AddressContext'
import { Pharmacies } from '@app/components/Phamracies'
import { AddressField, PageWrapper, Loader } from '@app/components'
import { LanguageSelect } from '@app/components/LanguageSelect'

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
      <div className="h-[6%]">
        <AddressField defaultAddress={address} />
        <LanguageSelect />
      </div>
      {latLng && (
        <Pharmacies address={address} location={latLng} distance={distance} />
      )}
    </PageWrapper>
  )
}
