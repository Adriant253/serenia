export const API_BASE =
  import.meta.env.VITE_API_URL || ''

export const ES_PRODUCCION = import.meta.env.PROD

export function mensajeErrorRed(error: unknown): string {
  if (error instanceof TypeError) {
    return ES_PRODUCCION
      ? 'No se pudo conectar con la API. Revisa VITE_API_URL en Vercel y que Render esté activo.'
      : 'No se pudo conectar con el servidor. Ejecuta: npm run dev'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Error al conectar con el servidor'
}
