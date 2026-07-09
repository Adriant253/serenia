import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { parseJsonResponse } from '../config/parseJsonResponse'
import { obtenerUsuarioSesion } from '../utils/sesionUsuario'

export interface RegistroEjercicio {
  veces: number
  ultimaFecha: string
}

export interface ProgresoEjercicios {
  completados: Record<string, RegistroEjercicio>
  totalCompletados: number
  historial: {
    ejercicioId: string
    titulo: string
    fecha: string
    duracionSegundos: number
  }[]
}

function progresoVacio(): ProgresoEjercicios {
  return {
    completados: {},
    totalCompletados: 0,
    historial: []
  }
}

export function obtenerVecesCompletado(
  progreso: ProgresoEjercicios,
  ejercicioId: string
): number {
  return progreso.completados[ejercicioId]?.veces ?? 0
}

export async function obtenerProgreso(
  idUsuario?: number
): Promise<ProgresoEjercicios> {
  const usuarioId =
    idUsuario ?? obtenerUsuarioSesion()?.id_usuario

  if (!usuarioId) {
    return progresoVacio()
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/progreso-ejercicios/${usuarioId}`
    )

    const data = await parseJsonResponse(response)

    if (data.success !== 1) {
      return progresoVacio()
    }

    return {
      completados:
        (data.completados as Record<string, RegistroEjercicio>) ??
        {},
      totalCompletados:
        Number(data.totalCompletados) || 0,
      historial:
        (data.historial as ProgresoEjercicios['historial']) ??
        []
    }
  } catch (error) {
    console.error('Error al obtener progreso:', error)
    return progresoVacio()
  }
}

export async function registrarEjercicioCompletado(
  ejercicioId: string,
  titulo: string,
  duracionSegundos: number,
  idUsuario?: number
): Promise<ProgresoEjercicios> {
  const usuarioId =
    idUsuario ?? obtenerUsuarioSesion()?.id_usuario

  if (!usuarioId) {
    throw new Error(
      'Debes iniciar sesión para guardar tu progreso'
    )
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/progreso-ejercicios`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_usuario: usuarioId,
          ejercicioId,
          titulo,
          duracionSegundos
        })
      }
    )

    const data = await parseJsonResponse(response, true)

    if (data.success !== 1) {
      throw new Error(
        String(
          data.mensaje ||
          'No se pudo guardar el progreso'
        )
      )
    }

    return {
      completados:
        (data.completados as Record<string, RegistroEjercicio>) ??
        {},
      totalCompletados:
        Number(data.totalCompletados) || 0,
      historial:
        (data.historial as ProgresoEjercicios['historial']) ??
        []
    }
  } catch (error) {
    throw new Error(mensajeErrorRed(error))
  }
}

export function formatearDuracion(
  segundos: number
): string {
  const minutos = Math.floor(segundos / 60)
  const resto = segundos % 60

  if (minutos === 0) {
    return `${resto}s`
  }

  if (resto === 0) {
    return `${minutos} min`
  }

  return `${minutos} min ${resto}s`
}
