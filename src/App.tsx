import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { MainPage } from './pages/MainPage'
import { AddressContextProvider } from './store/AddressContext'

import './globals.css'

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
