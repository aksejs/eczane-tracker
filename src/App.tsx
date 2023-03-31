import React, { FunctionComponent } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { MainPage } from './pages/MainPage'
import { AddressContextProvider } from './store/AddressContext'
import { LanguageContextProvider } from './store/LanguageContext'

import './globals.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddressContextProvider>
        <LanguageContextProvider>
          <MainPage />
          <ReactQueryDevtools />
        </LanguageContextProvider>
      </AddressContextProvider>
    </QueryClientProvider>
  )
}

export default App
