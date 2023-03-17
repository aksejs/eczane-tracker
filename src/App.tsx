import React from 'react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import { MainPage } from './pages'
import { AddressContextProvider } from './common/AddressContext'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <AddressContextProvider>
          <MainPage />
        </AddressContextProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
