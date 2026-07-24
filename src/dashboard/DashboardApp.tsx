import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom'

import SidebarNav from '../components/SidebarNav'

import {
  sembrarDatosDemo
} from '../services/seedDemoData'

import Datos from './Datos'

import EjerciciosEstres from '../ejercicios/EjerciciosEstres'

import Meditacion from './meditacion/Meditacion'

import type {
  VistaMeditacion
} from '../functions/meditacionF/meditacionTypes'

import EstadoAnimo from '../estadoAnimo/EstadoAnimo'

import HistorialPage from '../historial/HistorialPage'

import OrganizarPrioridades from './organizar/OrganizarPrioridades'

import Recordatorios from './recordatorios/Recordatorios'

import Suscripcion from './suscripcion/Suscripcion'

import ChatPage from '../chat/ChatPage'

import Perfil from '../perfil/Perfil'

import {
  SonidosRelajantes
} from '../sonidosRelajantes/sonidosRelajantes'

import './Dashboard.css'
import '../styles/app-ui.css'

interface DashboardAppProps {
  onCerrarSesion: () => void
}

function DashboardApp({
  onCerrarSesion
}: DashboardAppProps) {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  try {
    const usuario = JSON.parse(
      localStorage.getItem(
        'usuario'
      ) || 'null'
    ) as {
      id_usuario?: number
    } | null

    if (
      usuario?.id_usuario
    ) {
      sembrarDatosDemo(
        usuario.id_usuario
      )
    }
  } catch {
    /*
     * Ignorar datos inválidos
     * de la sesión.
     */
  }

  const abrirSuscripcion = (
    vistaMeditacion?: VistaMeditacion
  ) => {
    navigate(
      '/dashboard/suscripcion',
      {
        state: {
          volverA:
            location.pathname,
          vistaMeditacion
        }
      }
    )
  }

  const volverDesdeSuscripcion = () => {
    const estadoNavegacion =
      location.state as {
        volverA?: string
        vistaMeditacion?:
          VistaMeditacion
      } | null

    const volverA =
      estadoNavegacion
        ?.volverA
        ?.startsWith(
          '/dashboard/'
        )
        ? estadoNavegacion.volverA
        : '/dashboard/inicio'

    navigate(
      volverA,
      {
        replace: true,
        state:
          estadoNavegacion
            ?.vistaMeditacion
            ? {
              vistaMeditacion:
                estadoNavegacion
                  .vistaMeditacion
            }
            : null
      }
    )
  }

  return (
    <div className="dashboard-layout">
      <SidebarNav
        onLogout={onCerrarSesion}
      />

      <main className="dashboard-main">
        <Routes>
          <Route
            index
            element={
              <Navigate
                to="inicio"
                replace
              />
            }
          />

          <Route
            path="inicio"
            element={
              <Datos />
            }
          />

          <Route
            path="ejercicios"
            element={
              <EjerciciosEstres />
            }
          />

          <Route
            path="meditacion"
            element={
              <Meditacion
                onIrSuscripcion={
                  abrirSuscripcion
                }
              />
            }
          />

          <Route
            path="estado-animo"
            element={
              <EstadoAnimo />
            }
          />

          <Route
            path="historial"
            element={
              <HistorialPage />
            }
          />

          <Route
            path="organizar-prioridades"
            element={
              <OrganizarPrioridades
                onIrSuscripcion={
                  abrirSuscripcion
                }
              />
            }
          />

          <Route
            path="recordatorios"
            element={
              <Recordatorios
                onIrSuscripcion={
                  abrirSuscripcion
                }
              />
            }
          />

          <Route
            path="suscripcion"
            element={
              <Suscripcion
                onVolver={
                  volverDesdeSuscripcion
                }
              />
            }
          />

          <Route
            path="asistente"
            element={
              <ChatPage />
            }
          />

          <Route
            path="perfil"
            element={
              <Perfil />
            }
          />

          <Route
            path="sonidos-relajantes"
            element={
              <SonidosRelajantes />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="inicio"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default DashboardApp
