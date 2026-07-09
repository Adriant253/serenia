import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'
import { parseJsonResponse } from '../config/parseJsonResponse'

import {
  CATEGORIAS,
  EJERCICIOS as EJERCICIOS_LOCAL,
  type CategoriaEjercicio,
  type Ejercicio
} from '../data/ejerciciosData'

export type { CategoriaEjercicio, Ejercicio }

let cacheEjercicios: Ejercicio[] | null = null

function mapearEjercicioApi(
  data: Record<string, unknown>
): Ejercicio {
  return {
    id: String(data.id),
    titulo: String(data.titulo),
    categoria: data.categoria as CategoriaEjercicio,
    descripcion: String(data.descripcion),
    duracionEstimada: Number(data.duracionEstimada) || 0,
    icono: String(data.icono || '🌿'),
    pasos: Array.isArray(data.pasos)
      ? data.pasos as Ejercicio['pasos']
      : []
  }
}

export async function obtenerEjercicios(): Promise<Ejercicio[]> {
  if (cacheEjercicios) {
    return cacheEjercicios
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/ejercicios`
    )

    const data = await parseJsonResponse(response)

    if (
      data.success === 1 &&
      Array.isArray(data.ejercicios)
    ) {
      cacheEjercicios = (
        data.ejercicios as Record<string, unknown>[]
      ).map(mapearEjercicioApi)

      return cacheEjercicios
    }
  } catch (error) {
    console.error(
      'No se pudo cargar ejercicios desde la API:',
      error
    )
  }

  return EJERCICIOS_LOCAL
}

export async function obtenerEjercicioPorId(
  id: string
): Promise<Ejercicio | undefined> {
  const lista = await obtenerEjercicios()

  const local = lista.find(
    (ejercicio) => ejercicio.id === id
  )

  if (local) {
    return local
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/ejercicios/${encodeURIComponent(id)}`
    )

    const data = await parseJsonResponse(response)

    if (data.success === 1 && data.ejercicio) {
      return mapearEjercicioApi(
        data.ejercicio as Record<string, unknown>
      )
    }
  } catch (error) {
    console.error(
      'No se pudo cargar el ejercicio desde la API:',
      error
    )
  }

  return undefined
}

export function invalidarCacheEjercicios(): void {
  cacheEjercicios = null
}

export { CATEGORIAS }

export function calcularDuracionTotal(
  ejercicio: Ejercicio
): number {
  return ejercicio.pasos.reduce(
    (total, paso) =>
      total + paso.duracionSegundos,
    0
  )
}

export async function contarEjercicios(): Promise<number> {
  const lista = await obtenerEjercicios()
  return lista.length
}

export function mensajeErrorEjercicios(
  error: unknown
): string {
  return mensajeErrorRed(error)
}
