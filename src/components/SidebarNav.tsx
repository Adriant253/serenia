import {
  useEffect,
  useState
} from 'react'

import {
  NavLink
} from 'react-router-dom'

import {
  obtenerUsuarioSesion
} from '../utils/sesionUsuario'

import './SidebarNav.css'

interface SidebarNavProps {
  onLogout: () => void
}

function esUsuarioPremium(
  estado?: string
) {
  const normalizado = String(
    estado || 'free'
  )
    .trim()
    .toLowerCase()

  return (
    normalizado === 'premium' ||
    normalizado === 'premiun'
  )
}

function SidebarNav({
  onLogout
}: SidebarNavProps) {
  const [mostrarSuscripcion, setMostrarSuscripcion] =
    useState(() => {
      const usuario = obtenerUsuarioSesion()
      return !esUsuarioPremium(
        usuario?.estado_suscripcion
      )
    })

  useEffect(() => {
    const actualizarPlan = () => {
      const usuario = obtenerUsuarioSesion()
      setMostrarSuscripcion(
        !esUsuarioPremium(
          usuario?.estado_suscripcion
        )
      )
    }

    const onUsuarioActualizado = () => {
      actualizarPlan()
    }

    window.addEventListener(
      'usuario-actualizado',
      onUsuarioActualizado
    )

    window.addEventListener(
      'storage',
      actualizarPlan
    )

    return () => {
      window.removeEventListener(
        'usuario-actualizado',
        onUsuarioActualizado
      )

      window.removeEventListener(
        'storage',
        actualizarPlan
      )
    }
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src="/SereniaLogo.jpg"
          alt="Serenia"
          className="sidebar-logo"
        />

        <span className="sidebar-title">
          Serenia
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">

        <NavLink
          to="/dashboard/inicio"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
          end
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"
            />
          </svg>

          <span>
            Inicio
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/ejercicios"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M12 22c4-2.5 7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 3 8.5 7 11z"
            />

            <path
              d="M12 8v4"
            />

            <path
              d="M10 10h4"
            />
          </svg>

          <span>
            Ejercicios de estrés
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/meditacion"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M12 3c2.1 2.2 3.2 4.3 3.2 6.3A3.2 3.2 0 0 1 12 12.5a3.2 3.2 0 0 1-3.2-3.2C8.8 7.3 9.9 5.2 12 3z"
            />

            <path
              d="M4 10.5c3.5.1 6.2 1.4 8 4-2.1 2.5-4.6 3.6-7.4 3.2A3.7 3.7 0 0 1 4 10.5z"
            />

            <path
              d="M20 10.5c-3.5.1-6.2 1.4-8 4 2.1 2.5 4.6 3.6 7.4 3.2a3.7 3.7 0 0 0 .6-7.2z"
            />

            <path
              d="M7 20h10"
            />
          </svg>

          <span>
            Meditación
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/estado-animo"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />

            <path
              d="M8 14s1.5 2 4 2 4-2 4-2"
            />

            <line
              x1="9"
              y1="9"
              x2="9.01"
              y2="9"
            />

            <line
              x1="15"
              y1="9"
              x2="15.01"
              y2="9"
            />
          </svg>

          <span>
            Estado de ánimo
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/historial"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />

            <polyline
              points="12 6 12 12 16 14"
            />
          </svg>

          <span>
            Historial
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/organizar-prioridades"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="17"
              rx="2"
            />

            <line
              x1="8"
              y1="2"
              x2="8"
              y2="6"
            />

            <line
              x1="16"
              y1="2"
              x2="16"
              y2="6"
            />

            <line
              x1="3"
              y1="9"
              x2="21"
              y2="9"
            />

            <path
              d="m8 14 2 2 4-4"
            />
          </svg>

          <span>
            Organizar prioridades
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/recordatorios"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="13"
              r="8"
            />

            <path
              d="M12 9v4l2.5 2"
            />

            <path
              d="M5 3 2 6"
            />

            <path
              d="m19 3 3 3"
            />

            <path
              d="M9 21h6"
            />
          </svg>

          <span>
            Recordatorios de descanso
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/asistente"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            />
          </svg>

          <span>
            Asistente
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/perfil"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            />

            <circle
              cx="12"
              cy="7"
              r="4"
            />
          </svg>

          <span>
            Perfil
          </span>
        </NavLink>

        <NavLink
          to="/dashboard/sonidos-relajantes"
          className={({
            isActive
          }) =>
            isActive
              ? 'sidebar-link activo'
              : 'sidebar-link'
          }
        >
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M9 18V5l12-2v13"
            />

            <circle
              cx="6"
              cy="18"
              r="3"
            />

            <circle
              cx="18"
              cy="16"
              r="3"
            />
          </svg>

          <span>
            Sonidos relajantes
          </span>
        </NavLink>

        {mostrarSuscripcion && (
          <NavLink
            to="/dashboard/suscripcion"
            className={({
              isActive
            }) =>
              isActive
                ? 'sidebar-link activo sidebar-link-premium'
                : 'sidebar-link sidebar-link-premium'
            }
          >
            <svg
              className="sidebar-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d="M12 2l2.4 7.2H22l-6 4.4 2.3 7L12 16.8 5.7 20.6 8 13.6 2 9.2h7.6L12 2z"
              />
            </svg>

            <span>
              Suscripción
            </span>
          </NavLink>
        )}

      </nav>

      <button
        type="button"
        className="sidebar-link sidebar-link-logout"
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <svg
          className="sidebar-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
          />

          <polyline
            points="16 17 21 12 16 7"
          />

          <line
            x1="21"
            y1="12"
            x2="9"
            y2="12"
          />
        </svg>

        <span>
          Cerrar sesión
        </span>
      </button>
    </aside>
  )
}

export default SidebarNav
