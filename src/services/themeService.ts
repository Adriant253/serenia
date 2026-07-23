export type TemaApp =
  | 'serenia'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'dark'

export const TEMAS: {
  id: TemaApp
  nombre: string
  preview: string
}[] = [
  { id: 'serenia', nombre: 'Serenia', preview: '#4aa381' },
  { id: 'ocean', nombre: 'Océano', preview: '#0284c7' },
  { id: 'sunset', nombre: 'Atardecer', preview: '#ea580c' },
  { id: 'forest', nombre: 'Bosque', preview: '#3d9470' },
  { id: 'dark', nombre: 'Oscuro', preview: '#7bc8a4' }
]

const CLAVE = 'temaSerenia'
const CLAVE_PREFS = 'preferenciasPerfil'
const TEMA_DEFAULT: TemaApp = 'serenia'

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

function claveTema(idUsuario?: number | null): string {
  const id = idUsuario ?? obtenerIdUsuarioActual()
  return id ? `${CLAVE}_u_${id}` : CLAVE
}

function clavePrefs(idUsuario?: number | null): string {
  const id = idUsuario ?? obtenerIdUsuarioActual()
  return id ? `${CLAVE_PREFS}_u_${id}` : CLAVE_PREFS
}

function esTemaValido(
  valor: unknown
): valor is TemaApp {
  return (
    typeof valor === 'string' &&
    TEMAS.some(t => t.id === valor)
  )
}

function leerTemaDePrefs(
  clave: string
): TemaApp | null {
  try {
    const prefsRaw = localStorage.getItem(clave)

    if (!prefsRaw) {
      return null
    }

    const prefs = JSON.parse(prefsRaw)

    if (esTemaValido(prefs.tema)) {
      return prefs.tema
    }
  } catch {
    /* ignorar */
  }

  return null
}

export function obtenerTema(
  idUsuario?: number | null
): TemaApp {
  const id = idUsuario ?? obtenerIdUsuarioActual()

  try {
    const temaPrefsUsuario =
      leerTemaDePrefs(clavePrefs(id))

    if (temaPrefsUsuario) {
      return temaPrefsUsuario
    }

    const guardadoUsuario =
      localStorage.getItem(claveTema(id))

    if (esTemaValido(guardadoUsuario)) {
      return guardadoUsuario
    }

    // Migración de claves globales antiguas
    if (id) {
      const temaPrefsGlobal =
        leerTemaDePrefs(CLAVE_PREFS)

      if (temaPrefsGlobal) {
        return temaPrefsGlobal
      }

      const guardadoGlobal =
        localStorage.getItem(CLAVE)

      if (esTemaValido(guardadoGlobal)) {
        return guardadoGlobal
      }
    }
  } catch {
    /* ignorar */
  }

  return TEMA_DEFAULT
}

export function guardarTema(
  tema: TemaApp,
  idUsuario?: number | null
): void {
  const id = idUsuario ?? obtenerIdUsuarioActual()
  const claveTemaActual = claveTema(id)
  const clavePrefsActual = clavePrefs(id)

  localStorage.setItem(claveTemaActual, tema)
  localStorage.setItem(CLAVE, tema)

  try {
    const prefsRaw =
      localStorage.getItem(clavePrefsActual) ||
      localStorage.getItem(CLAVE_PREFS)

    const prefs = prefsRaw
      ? JSON.parse(prefsRaw)
      : {}

    const preferencias = { ...prefs, tema }

    localStorage.setItem(
      clavePrefsActual,
      JSON.stringify(preferencias)
    )

    localStorage.setItem(
      CLAVE_PREFS,
      JSON.stringify(preferencias)
    )
  } catch {
    /* ignorar */
  }
}

export function aplicarTemaVisual(tema: TemaApp): void {
  document.documentElement.dataset.theme = tema
}

export function aplicarTema(
  tema: TemaApp,
  idUsuario?: number | null
): void {
  aplicarTemaVisual(tema)
  guardarTema(tema, idUsuario)
}

export function restaurarTemaUsuario(
  idUsuario: number
): TemaApp {
  const tema = obtenerTema(idUsuario)
  aplicarTema(tema, idUsuario)
  return tema
}
