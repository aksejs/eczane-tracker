import React from 'react'
import { ThemeProvider } from '@emotion/react'
import theme from '@rebass/preset'

import { MainPage } from './pages'
import { AddressContextProvider } from './common/AddressContext'

const App: React.FC = () => {
  return (
    <div className="App">
      <AddressContextProvider>
        <ThemeProvider theme={theme}>
          <MainPage />
        </ThemeProvider>
      </AddressContextProvider>
    </div>
  )
}

export default App
