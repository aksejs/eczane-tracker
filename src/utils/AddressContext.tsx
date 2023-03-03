import React, { createContext, useState } from 'react'
import { usePersistStore } from './hooks'

export const AddressContext = createContext<{
  address?: string
  setAddress: (address: string) => void
}>({ address: '', setAddress: () => {} })

export const AddressContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [addressCache, setAddressCache] = usePersistStore('address', {
    address: '',
  })

  const [address, setAddress] = useState(addressCache.address || '')

  const setContextAddress = (address: string) => {
    setAddress(address)
    setAddressCache({ address })
  }

  return (
    <AddressContext.Provider value={{ address, setAddress: setContextAddress }}>
      {children}
    </AddressContext.Provider>
  )
}
