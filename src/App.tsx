import React from 'react'
import { MainPage } from './pages'

import './App.css'
import { AddressContextProvider } from './utils/AddressContext'

const App: React.FC = () => {
  return (
    <div className="App">
      <AddressContextProvider>
        <MainPage />
      </AddressContextProvider>
    </div>
  )
}

export default App
