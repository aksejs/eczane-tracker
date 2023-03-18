import { ThemeProvider } from 'styled-components'

import ReactDOM from 'react-dom/client'
import App from './App'

import { colors, ResetStyle, GlobalStyle } from './styles'

const GlobalStyles = () => (
  <>
    <GlobalStyle />
    <ResetStyle />
  </>
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={{ ...colors }}>
    <GlobalStyles />
    <App />
  </ThemeProvider>
)
