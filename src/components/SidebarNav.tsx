import {
  NavLink
} from 'react-router-dom'

import './SidebarNav.css'

interface SidebarNavProps {
  onLogout: () => void
}

function SidebarNav({
  onLogout
}: SidebarNavProps) {

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

      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard/inicio"
          className={({ isActive }) =>
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
            <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>

          <span>Inicio</span>

        </NavLink>

        <NavLink
          to="/dashboard/ejercicios"
          className={({ isActive }) =>
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
            <path d="M12 22c4-2.5 7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 3 8.5 7 11z" />
            <path d="M12 8v4" />
            <path d="M10 10h4" />
          </svg>

          <span>Ejercicios de estrés</span>

        </NavLink>

        <NavLink
          to="/dashboard/estado-animo"
          className={({ isActive }) =>
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
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>

          <span>Estado de ánimo</span>

        </NavLink>

        <NavLink
          to="/dashboard/historial"
          className={({ isActive }) =>
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>

          <span>Historial</span>

        </NavLink>

        <NavLink
          to="/dashboard/asistente"
          className={({ isActive }) =>
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          <span>Asistente</span>

        </NavLink>

        <NavLink
          to="/dashboard/perfil"
          className={({ isActive }) =>
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>

          <span>Perfil</span>

        </NavLink>

        <button
          type="button"
          className="sidebar-link sidebar-link-logout"
          onClick={onLogout}
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>

          <span>Cerrar sesión</span>

        </button>

      </nav>

    </aside>

  )

}

export default SidebarNav
