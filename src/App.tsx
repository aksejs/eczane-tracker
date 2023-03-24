import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { MainPage } from './pages'
import { AddressContextProvider } from './common/AddressContext'

import './styles/globals.css'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AddressContextProvider>
        <MainPage />
        <ReactQueryDevtools />
      </AddressContextProvider>
    </QueryClientProvider>
  )
}

export default App
