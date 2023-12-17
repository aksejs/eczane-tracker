import { useContext } from 'react'

import { AddressContext } from '@app/store/AddressContext'
import { Pharmacies } from '@app/components/Phamracies'
import { AddressField, PageWrapper, Loader } from '@app/components'
import { LanguageSelect } from '@app/components/LanguageSelect'

export function MainPage() {
  const { address, loading } = useContext(AddressContext)

  if (loading || !address) {
    return (
      <PageWrapper>
        <Loader />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="h-[6%] min-h-[52px] flex items-center">
        <AddressField defaultAddress={address} />
        <LanguageSelect />
      </div>
      {address.location && <Pharmacies address={address} />}
    </PageWrapper>
  )
}
