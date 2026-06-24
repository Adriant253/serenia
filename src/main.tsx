import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { ThemeProvider } from './context/ThemeContext'
import { aplicarTema, obtenerTema } from './services/themeService'

import './styles/theme.css'
import './index.css'
import App from './App.tsx'

aplicarTema(obtenerTema())

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

createRoot(
  document.getElementById('root')!
).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
