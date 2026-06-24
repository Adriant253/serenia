import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { parseJsonResponse } from '../config/parseJsonResponse'

export async function login(
  email: string,
  contrasena: string
) {

  try {
    const response =
      await fetch(
        `${API_BASE}/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            contrasena
          })
        }
      )

    return parseJsonResponse(response, true)
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}

export async function register(
  nombre: string,
  email: string,
  contrasena: string,
  fecha_nacimiento: string
) {

  try {
    const response =
      await fetch(
        `${API_BASE}/api/registro`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            nombre,
            email: email.trim(),
            contrasena,
            fecha_nacimiento
          })
        }
      )

    return parseJsonResponse(response, true)
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}
