import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Register from './auth/Register'
import RecuperarContrasena from './auth/RecuperarContrasena'
import CambiarContrasena from './auth/CambiarContrasena'
import DashboardApp from './dashboard/DashboardApp'
import { RUTA_LOGIN_LANDING } from './config/authRoutes'

function App() {

  const usuario =
    localStorage.getItem('usuario')

  return (

    <Routes>

      <Route
        path="/"
        element={
          usuario
            ? <Navigate to="/dashboard/inicio" replace />
            : <LandingPage />
        }
      />

      <Route
        path="/login"
        element={
          usuario
            ? <Navigate to="/dashboard/inicio" replace />
            : <Navigate to={RUTA_LOGIN_LANDING} replace />
        }
      />

      <Route
        path="/registro"
        element={
          usuario
            ? <Navigate to="/dashboard/inicio" replace />
            : <Register />
        }
      />

      <Route
        path="/recuperar-contrasena"
        element={<RecuperarContrasena />}
      />

      <Route
        path="/cambiar-contrasena"
        element={<CambiarContrasena />}
      />

      <Route
        path="/dashboard/*"
        element={
          usuario
            ? <DashboardApp />
            : <Navigate to="/" replace />
        }
      />

    </Routes>

  )

}

export default App
