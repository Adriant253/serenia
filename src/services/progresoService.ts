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

const CLAVE_PROGRESO = 'progresoEjercicios'

function progresoVacio(): ProgresoEjercicios {
  return {
    completados: {},
    totalCompletados: 0,
    historial: []
  }
}

export function obtenerProgreso(): ProgresoEjercicios {
  try {
    const datos =
      localStorage.getItem(CLAVE_PROGRESO)

    if (!datos) {
      return progresoVacio()
    }

    return JSON.parse(datos) as ProgresoEjercicios
  } catch {
    return progresoVacio()
  }
}

export function registrarEjercicioCompletado(
  ejercicioId: string,
  titulo: string,
  duracionSegundos: number
): ProgresoEjercicios {
  const progreso = obtenerProgreso()
  const ahora = new Date().toISOString()

  const registroActual =
    progreso.completados[ejercicioId]

  progreso.completados[ejercicioId] = {
    veces: (registroActual?.veces ?? 0) + 1,
    ultimaFecha: ahora
  }

  progreso.totalCompletados += 1

  progreso.historial.unshift({
    ejercicioId,
    titulo,
    fecha: ahora,
    duracionSegundos
  })

  if (progreso.historial.length > 20) {
    progreso.historial =
      progreso.historial.slice(0, 20)
  }

  localStorage.setItem(
    CLAVE_PROGRESO,
    JSON.stringify(progreso)
  )

  return progreso
}

export function obtenerVecesCompletado(
  ejercicioId: string
): number {
  return (
    obtenerProgreso().completados[
      ejercicioId
    ]?.veces ?? 0
  )
}

export function formatearDuracion(
  segundos: number
): string {
  const minutos = Math.floor(
    segundos / 60
  )
  const resto = segundos % 60

  if (minutos === 0) {
    return `${resto}s`
  }

  if (resto === 0) {
    return `${minutos} min`
  }

  return `${minutos} min ${resto}s`
}
