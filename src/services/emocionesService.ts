import {
  obtenerEmocionPorId
} from '../data/emocionesData'

import {
  obtenerCausaPorId,
  obtenerMomentoPorId
} from '../data/estresLaboralData'

export interface RegistroEmocion {
  id: string
  id_usuario: number
  emocionId: string
  etiqueta: string
  emoji: string
  color: string
  nota: string
  fecha: string
  nivelEstres: number
  causaEstresId?: string
  causaEstresEtiqueta?: string
  momentoLaboralId?: string
  momentoLaboralEtiqueta?: string
}

export interface ResumenEmocional {
  total: number
  porEmocion: Record<
    string,
    { etiqueta: string; emoji: string; color: string; cantidad: number }
  >
}

function claveHistorial(
  idUsuario: number
): string {
  return `historialEmociones_${idUsuario}`
}

function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function obtenerHistorialEmocional(
  idUsuario: number
): RegistroEmocion[] {
  try {
    const datos = localStorage.getItem(
      claveHistorial(idUsuario)
    )

    if (!datos) {
      return []
    }

    const historial =
      JSON.parse(datos) as RegistroEmocion[]

    return historial.sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    )
  } catch {
    return []
  }
}

export function registrarEmocion(
  idUsuario: number,
  emocionId: string,
  nota = '',
  nivelEstres = 5,
  causaEstresId?: string,
  momentoLaboralId?: string
): RegistroEmocion | null {
  const emocion =
    obtenerEmocionPorId(emocionId)

  if (!emocion) {
    return null
  }

  const causa = causaEstresId
    ? obtenerCausaPorId(causaEstresId)
    : undefined

  const momento = momentoLaboralId
    ? obtenerMomentoPorId(momentoLaboralId)
    : undefined

  const registro: RegistroEmocion = {
    id: generarId(),
    id_usuario: idUsuario,
    emocionId: emocion.id,
    etiqueta: emocion.etiqueta,
    emoji: emocion.emoji,
    color: emocion.color,
    nota: nota.trim(),
    fecha: new Date().toISOString(),
    nivelEstres,
    causaEstresId: causa?.id,
    causaEstresEtiqueta: causa?.etiqueta,
    momentoLaboralId: momento?.id,
    momentoLaboralEtiqueta: momento?.etiqueta
  }

  const historial =
    obtenerHistorialEmocional(idUsuario)

  historial.unshift(registro)

  localStorage.setItem(
    claveHistorial(idUsuario),
    JSON.stringify(historial)
  )

  return registro
}

export function filtrarRegistrosPorFecha(
  registros: RegistroEmocion[],
  fechaDesde: string,
  fechaHasta: string
): RegistroEmocion[] {
  if (!fechaDesde && !fechaHasta) {
    return registros
  }

  return registros.filter((registro) => {
    const fecha = new Date(registro.fecha)
      .toISOString()
      .slice(0, 10)

    if (fechaDesde && fecha < fechaDesde) {
      return false
    }

    if (fechaHasta && fecha > fechaHasta) {
      return false
    }

    return true
  })
}

export function generarResumenEmocional(
  registros: RegistroEmocion[]
): ResumenEmocional {
  const porEmocion: ResumenEmocional['porEmocion'] = {}

  for (const registro of registros) {
    if (!porEmocion[registro.emocionId]) {
      porEmocion[registro.emocionId] = {
        etiqueta: registro.etiqueta,
        emoji: registro.emoji,
        color: registro.color,
        cantidad: 0
      }
    }

    porEmocion[registro.emocionId].cantidad += 1
  }

  return {
    total: registros.length,
    porEmocion
  }
}
