import { Link } from 'react-router-dom'

import { RUTA_LOGIN_LANDING } from '../../config/authRoutes'

import '../../styles/Auth.css'

interface AuthVolverLinkProps {
  texto?: string
}

export function AuthVolverLink({
  texto = 'Volver al inicio de sesión'
}: AuthVolverLinkProps) {
  return (
    <Link
      to={RUTA_LOGIN_LANDING}
      className="auth-volver-btn"
    >
      {texto}
    </Link>
  )
}
