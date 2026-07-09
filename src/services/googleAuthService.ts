import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { parseJsonResponse } from '../config/parseJsonResponse'
import { aplicarTema } from './themeService'
import {
  guardarUsuarioSesion
} from '../utils/sesionUsuario'

export async function loginGoogle(
  credential: string
) {
  try {
    const response = await fetch(
      `${API_BASE}/api/auth/google`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential })
      }
    )

    const data = await parseJsonResponse(response, true)

    if (!response.ok) {
      throw new Error(
        String(
          data.mensaje ||
          'Error al iniciar sesión con Google'
        )
      )
    }

    return data
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}

export function guardarSesion(
  data: Record<string, unknown>
) {
  const { success: _s, mensaje: _m, ...usuario } = data
  guardarUsuarioSesion(usuario)
  aplicarTema('dark')
  window.location.href = '/dashboard/inicio'
}
