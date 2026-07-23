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

function obtenerIdUsuarioActual(): number | null {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || 'null'
    ) as { id_usuario?: number } | null

    const id = Number(usuario?.id_usuario)

    if (Number.isInteger(id) && id > 0) {
      return id
    }
  } catch {
    /* ignorar */
  }

  return null
}

function clavePrefs(idUsuario?: number | null): string {
  const id = idUsuario ?? obtenerIdUsuarioActual()
  return id ? `${CLAVE}_u_${id}` : CLAVE
}

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

export function obtenerPreferencias(
  idUsuario?: number | null
): PreferenciasPerfil {
  const id = idUsuario ?? obtenerIdUsuarioActual()

  try {
    const datos =
      localStorage.getItem(clavePrefs(id)) ||
      (id ? localStorage.getItem(CLAVE) : null)

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
  preferencias: PreferenciasPerfil,
  idUsuario?: number | null
): void {
  const id = idUsuario ?? obtenerIdUsuarioActual()
  const payload = JSON.stringify(preferencias)

  localStorage.setItem(clavePrefs(id), payload)
  localStorage.setItem(CLAVE, payload)
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
