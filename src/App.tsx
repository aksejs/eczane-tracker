import React, { FunctionComponent } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { MainPage } from './pages/MainPage'
import { AddressContextProvider } from './store/AddressContext'
import { LanguageContextProvider } from './store/LanguageContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MapContextProvider } from './store/MapContext'

import './globals.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddressContextProvider>
        <MapContextProvider>
          <LanguageContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainPage />} />
              </Routes>
            </BrowserRouter>
            <ReactQueryDevtools />
          </LanguageContextProvider>
        </MapContextProvider>
      </AddressContextProvider>
    </QueryClientProvider>
  )
}

export default App
