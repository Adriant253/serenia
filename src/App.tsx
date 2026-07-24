import {
  useCallback,
  useEffect,
  useReducer
} from 'react'

import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Register from './auth/Register'
import RecuperarContrasena from './auth/RecuperarContrasena'
import CambiarContrasena from './auth/CambiarContrasena'
import DashboardApp from './dashboard/DashboardApp'

import {
  RUTA_LOGIN_LANDING
} from './config/authRoutes'

import {
  aplicarTemaVisual
} from './services/themeService'

interface UsuarioSesion {
  id_usuario?: number
}

function obtenerUsuarioSesion():
  UsuarioSesion | null {

  try {
    const usuarioGuardado =
      localStorage.getItem('usuario')

    if (!usuarioGuardado) {
      return null
    }

    const usuario =
      JSON.parse(
        usuarioGuardado
      ) as UsuarioSesion

    if (
      !usuario ||
      !usuario.id_usuario
    ) {
      return null
    }

    return usuario
  } catch {
    return null
  }
}

function App() {
  const navigate =
    useNavigate()

  /*
   * Se utiliza para forzar que App revise
   * nuevamente el localStorage.
   */
  const [
    ,
    actualizarSesion
  ] = useReducer(
    (valor: number) =>
      valor + 1,
    0
  )

  const usuario =
    obtenerUsuarioSesion()

  const cerrarSesion =
    useCallback(() => {

      localStorage.removeItem(
        'usuario'
      )

      aplicarTemaVisual('serenia')

      /*
       * Actualiza inmediatamente las rutas
       * protegidas.
       */
      actualizarSesion()

      /*
       * replace evita conservar la página
       * actual del dashboard en el historial.
       */
      navigate('/', {
        replace: true
      })

    }, [navigate])

  useEffect(() => {
    /*
     * Se ejecuta cuando el usuario regresa
     * con los botones atrás o adelante.
     */
    const revisarSesion = () => {
      actualizarSesion()
    }

    window.addEventListener(
      'pageshow',
      revisarSesion
    )

    window.addEventListener(
      'popstate',
      revisarSesion
    )

    window.addEventListener(
      'storage',
      revisarSesion
    )

    return () => {
      window.removeEventListener(
        'pageshow',
        revisarSesion
      )

      window.removeEventListener(
        'popstate',
        revisarSesion
      )

      window.removeEventListener(
        'storage',
        revisarSesion
      )
    }
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          usuario
            ? (
              <Navigate
                to="/dashboard/inicio"
                replace
              />
            )
            : (
              <LandingPage />
            )
        }
      />

      <Route
        path="/login"
        element={
          usuario
            ? (
              <Navigate
                to="/dashboard/inicio"
                replace
              />
            )
            : (
              <Navigate
                to={
                  RUTA_LOGIN_LANDING
                }
                replace
              />
            )
        }
      />

      <Route
        path="/registro"
        element={
          usuario
            ? (
              <Navigate
                to="/dashboard/inicio"
                replace
              />
            )
            : (
              <Register />
            )
        }
      />

      <Route
        path="/recuperar-contrasena"
        element={
          <RecuperarContrasena />
        }
      />

      <Route
        path="/cambiar-contrasena"
        element={
          <CambiarContrasena />
        }
      />

      <Route
        path="/dashboard/*"
        element={
          usuario
            ? (
              <DashboardApp
                onCerrarSesion={
                  cerrarSesion
                }
              />
            )
            : (
              <Navigate
                to="/"
                replace
              />
            )
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App
