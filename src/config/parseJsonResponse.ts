import { ES_PRODUCCION } from './api'

function mensajeSinConexion(): string {
  return ES_PRODUCCION
    ? 'No se pudo conectar con la API. Verifica que Render esté activo y VITE_API_URL en Vercel.'
    : 'No se pudo conectar con el servidor. Ejecuta: npm run dev'
}

export async function parseJsonResponse(
  response: Response,
  permitirErrorJson = false
): Promise<Record<string, unknown>> {
  const text = await response.text()

  if (!text.trim()) {
    throw new Error(
      !response.ok
        ? mensajeSinConexion()
        : 'Respuesta vacía del servidor'
    )
  }

  let data: Record<string, unknown>

  try {
    data = JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error(
      !response.ok
        ? mensajeSinConexion()
        : 'Respuesta inválida del servidor'
    )
  }

  if (!response.ok && !permitirErrorJson) {
    throw new Error(
      String(
        data.mensaje ||
        'Error al conectar con el servidor'
      )
    )
  }

  return data
}
