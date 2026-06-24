import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { fetchConTimeout } from '../config/fetchConTimeout'
import { parseJsonResponse } from '../config/parseJsonResponse'

export async function solicitarRecuperacion(
  email: string,
  token: string
) {

  try {
    const response = await fetchConTimeout(
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
      },
      60_000
    )

    return parseJsonResponse(response, true)
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
    const response = await fetchConTimeout(
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

    return parseJsonResponse(response, true)
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}
