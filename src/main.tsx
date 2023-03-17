import { ThemeProvider } from 'styled-components'
import Geocode from 'react-geocode'

import ReactDOM from 'react-dom/client'
import App from './App'

import { GOOGLE_API_KEY } from './common/contants'
import { colors, ResetStyle, GlobalStyle } from './styles'

const GlobalStyles = () => (
  <>
    <GlobalStyle />
    <ResetStyle />
  </>
)

Geocode.setApiKey(GOOGLE_API_KEY)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={{ ...colors }}>
    <GlobalStyles />
    <App />
  </ThemeProvider>
)
