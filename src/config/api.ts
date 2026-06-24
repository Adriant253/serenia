export const API_BASE =
  import.meta.env.VITE_API_URL || ''

export function mensajeErrorRed(error: unknown): string {
  if (error instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Reinicia el proyecto con: npm run dev'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Error al conectar con el servidor'
}
