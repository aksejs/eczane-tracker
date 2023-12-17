import React, { FunctionComponent } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { MainPage } from './pages/MainPage'
import { AddressContextProvider } from './store/AddressContext'
import { LanguageContextProvider } from './store/LanguageContext'

import './globals.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddressContextProvider>
        <LanguageContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools />
        </LanguageContextProvider>
      </AddressContextProvider>
    </QueryClientProvider>
  )
}

export default App
