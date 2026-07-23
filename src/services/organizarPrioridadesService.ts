import {
  mensajeErrorRed
} from '../config/api'

import {
  parseJsonResponse
} from '../config/parseJsonResponse'

const API_URL =
  'https://serenia-api.onrender.com'

export type PrioridadTarea =
  | 'Alta'
  | 'Media'
  | 'Baja'

export type EstadoTarea =
  | 'Pendiente'
  | 'Completada'

export type NotificarVencimiento =
  | 1
  | 0
  | null

export interface GuardarOrganizarPrioridad {
  titulo: string
  descripcion: string
  fechaInicio: string
  fecha: string
  prioridad: PrioridadTarea
  estado: EstadoTarea
  Usuarios_id_usuario: number
  notificar_vencimiento?: NotificarVencimiento
}

export interface EditarOrganizarPrioridad
  extends GuardarOrganizarPrioridad {
  id_tarea: number
}

export interface EliminarOrganizarPrioridad {
  id_tarea: number
  Usuarios_id_usuario: number
}

export async function guardarOrganizarPrioridad(
  datos: GuardarOrganizarPrioridad
) {
  try {
    const response = await fetch(
      `${API_URL}/api/organizar-prioridades/guardar`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )

    return parseJsonResponse(response, true)

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function obtenerOrganizarPrioridadesUsuario(
  id_usuario: number
) {
  try {
    const response = await fetch(
      `${API_URL}/api/organizar-prioridades/usuario/${id_usuario}`,
      {
        method: 'GET',

        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return parseJsonResponse(response, true)

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function editarOrganizarPrioridad(
  datos: EditarOrganizarPrioridad
) {
  try {
    const response = await fetch(
      `${API_URL}/api/organizar-prioridades/editar`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )

    return parseJsonResponse(response, true)

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function eliminarOrganizarPrioridad(
  datos: EliminarOrganizarPrioridad
) {
  try {
    const response = await fetch(
      `${API_URL}/api/organizar-prioridades/eliminar`,
      {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )

    return parseJsonResponse(response, true)

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}