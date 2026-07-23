import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { parseJsonResponse } from '../config/parseJsonResponse'
import { restaurarTemaUsuario } from './themeService'
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
  const idUsuario = Number(data.id_usuario)

  const usuario = {
    id_usuario: idUsuario,
    nombre: String(data.nombre || ''),
    email: String(data.email || ''),
    estado_suscripcion: String(
      data.estado_suscripcion || 'free'
    )
      .trim()
      .toLowerCase(),
    fecha_nacimiento: data.fecha_nacimiento
      ? String(data.fecha_nacimiento)
      : undefined,
    fecha_registro: data.fecha_registro
      ? String(data.fecha_registro)
      : undefined
  }

  guardarUsuarioSesion(usuario)

  if (Number.isInteger(idUsuario) && idUsuario > 0) {
    restaurarTemaUsuario(idUsuario)
  }

  window.location.href = '/dashboard/inicio'
}
