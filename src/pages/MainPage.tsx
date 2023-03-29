import { FunctionComponent, ReactNode, useContext } from 'react'
import _ from 'lodash'

import { AddressContext } from '@/store/AddressContext'
import { PharmaciesMap } from '@/features/PharmaciesMap'
import AddressField from '@/components/AddressField/AddressField'

const PageWrapper: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 h-screen dark:text-zinc-300">
      {children}
    </div>
  )
}

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
