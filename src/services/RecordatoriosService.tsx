import {
  mensajeErrorRed
} from '../config/api'

import {
  parseJsonResponse
} from '../config/parseJsonResponse'

const API_URL =
  'https://serenia-api.onrender.com'

export type EstadoRecordatorio =
  | 'activo'
  | 'pausado'

export interface GuardarRecordatorioDescanso {
  hora: string
  nombre: string
  mensaje: string | null
  dias: number[]
  estado: EstadoRecordatorio
  Usuarios_id_usuario: number
}

export interface EditarRecordatorioDescanso
  extends GuardarRecordatorioDescanso {
  id_recordatorio: number
}

export interface EliminarRecordatorioDescanso {
  id_recordatorio: number
  Usuarios_id_usuario: number
}

export async function guardarRecordatorioDescanso(
  datos: GuardarRecordatorioDescanso
) {
  try {
    const response = await fetch(
      `${API_URL}/api/recordatorios-descanso/guardar`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )

    return parseJsonResponse(
      response,
      true
    )

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function obtenerRecordatoriosDescansoUsuario(
  id_usuario: number
) {
  try {
    const response = await fetch(
      `${API_URL}/api/recordatorios-descanso/usuario/${id_usuario}`,
      {
        method: 'GET',

        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return parseJsonResponse(
      response,
      true
    )

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function editarRecordatorioDescanso(
  datos: EditarRecordatorioDescanso
) {
  try {
    const response = await fetch(
      `${API_URL}/api/recordatorios-descanso/editar`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )

    return parseJsonResponse(
      response,
      true
    )

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function eliminarRecordatorioDescanso(
  datos: EliminarRecordatorioDescanso
) {
  try {
    const response = await fetch(
      `${API_URL}/api/recordatorios-descanso/eliminar`,
      {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )

    return parseJsonResponse(
      response,
      true
    )

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}