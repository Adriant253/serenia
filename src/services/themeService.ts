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

function esTemaValido(
  valor: unknown
): valor is TemaApp {
  return (
    typeof valor === 'string' &&
    TEMAS.some(t => t.id === valor)
  )
}

export function obtenerTema(): TemaApp {
  try {
    const prefsRaw =
      localStorage.getItem(CLAVE_PREFS)

    if (prefsRaw) {
      const prefs = JSON.parse(prefsRaw)

      if (esTemaValido(prefs.tema)) {
        return prefs.tema
      }
    }

    const guardado =
      localStorage.getItem(CLAVE)

    if (esTemaValido(guardado)) {
      return guardado
    }
  } catch {
    /* ignorar */
  }

  return 'serenia'
}

export function guardarTema(tema: TemaApp): void {
  localStorage.setItem(CLAVE, tema)

  try {
    const prefsRaw =
      localStorage.getItem(CLAVE_PREFS)

    const prefs = prefsRaw
      ? JSON.parse(prefsRaw)
      : {}

    localStorage.setItem(
      CLAVE_PREFS,
      JSON.stringify({ ...prefs, tema })
    )
  } catch {
    /* ignorar */
  }
}

export function aplicarTema(tema: TemaApp): void {
  document.documentElement.dataset.theme = tema
  guardarTema(tema)
}
