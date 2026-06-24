import type { TemaApp } from './themeService'

export interface PreferenciasPerfil {
  nombreMostrar: string
  sectorLaboral: string
  horaInicioJornada: string
  horaFinJornada: string
  metaCheckInsSemanal: number
  metaEjerciciosSemanal: number
  recordatorioCheckIn: boolean
  mensajeMotivacion: string
  tema?: TemaApp
}

const CLAVE = 'preferenciasPerfil'

function preferenciasDefault(): PreferenciasPerfil {
  return {
    nombreMostrar: '',
    sectorLaboral: '',
    horaInicioJornada: '09:00',
    horaFinJornada: '18:00',
    metaCheckInsSemanal: 5,
    metaEjerciciosSemanal: 3,
    recordatorioCheckIn: true,
    mensajeMotivacion:
      'Cuidar mi bienestar me hace mejor profesional.',
    tema: 'serenia'
  }
}

export function obtenerPreferencias(): PreferenciasPerfil {
  try {
    const datos =
      localStorage.getItem(CLAVE)

    if (!datos) {
      return preferenciasDefault()
    }

    return {
      ...preferenciasDefault(),
      ...JSON.parse(datos)
    }
  } catch {
    return preferenciasDefault()
  }
}

export function guardarPreferencias(
  preferencias: PreferenciasPerfil
): void {
  localStorage.setItem(
    CLAVE,
    JSON.stringify(preferencias)
  )
}

export function obtenerNombreMostrar(
  nombreCompleto: string
): string {
  const prefs = obtenerPreferencias()

  if (prefs.nombreMostrar.trim()) {
    return prefs.nombreMostrar.trim()
  }

  return nombreCompleto.split(' ')[0]
}
