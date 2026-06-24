import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'

import {
  aplicarTema,
  obtenerTema,
  type TemaApp
} from '../services/themeService'

interface ThemeContextValue {
  tema: TemaApp
  setTema: (tema: TemaApp) => void
}

const ThemeContext =
  createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children
}: {
  children: ReactNode
}) {

  const [tema, setTemaState] =
    useState<TemaApp>(obtenerTema)

  useEffect(() => {
    aplicarTema(tema)
  }, [tema])

  const setTema = (nuevo: TemaApp) => {
    setTemaState(nuevo)
    aplicarTema(nuevo)
  }

  return (
    <ThemeContext.Provider
      value={{ tema, setTema }}
    >
      {children}
    </ThemeContext.Provider>
  )

}

export function useTheme() {
  const ctx = useContext(ThemeContext)

  if (!ctx) {
    throw new Error(
      'useTheme debe usarse dentro de ThemeProvider'
    )
  }

  return ctx
}
