import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { parseJsonResponse } from '../config/parseJsonResponse'

export async function solicitarRecuperacion(
  email: string,
  token: string
) {

  try {
    const response = await fetch(
      `${API_BASE}/api/solicitar-recuperacion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          token
        })
      }
    )

    return parseJsonResponse(response)
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}

export async function cambiarContrasenaService(
  email: string,
  token: string,
  nuevaContrasena: string
) {

  try {
    const response = await fetch(
      `${API_BASE}/api/cambiar-contrasena`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          token: token.trim(),
          nuevaContrasena
        })
      }
    )

    return parseJsonResponse(response)
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}
