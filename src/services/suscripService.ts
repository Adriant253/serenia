import {
  mensajeErrorRed
} from '../config/api'

import {
  parseJsonResponse
} from '../config/parseJsonResponse'

const API_URL =
  'https://serenia-api.onrender.com'


export interface ActivarPremiumDatos {
  id_usuario: number
}

export interface RespuestaActivarPremium {
  success: number
  mensaje: string
  id_usuario: number | null
  nombre: string | null
  email: string | null
  estado_suscripcion: string | null
}

async function obtenerRespuestaJson(
  response: Response
): Promise<RespuestaActivarPremium> {
  try {
    return await response.json()
  } catch {
    throw new Error(
      'El servidor devolvió una respuesta inválida.'
    )
  }
}

export async function activarUsuarioPremium(
  datos: ActivarPremiumDatos
): Promise<RespuestaActivarPremium> {
  try {
    const response = await fetch(
      `${API_URL}/api/usuarios/activar-premium`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify(
          datos
        )
      }
    )

    const resultado =
      await obtenerRespuestaJson(
        response
      )

    if (!response.ok) {
      throw new Error(
        resultado.mensaje ||
        'No se pudo activar la suscripción Premium.'
      )
    }

    return resultado

  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error(
      'No se pudo conectar con el servidor.'
    )
  }
}