export async function parseJsonResponse(
  response: Response,
  permitirErrorJson = false
): Promise<Record<string, unknown>> {
  const text = await response.text()

  if (!text.trim()) {
    throw new Error(
      !response.ok
        ? 'No se pudo conectar con el servidor. Reinicia el proyecto con: npm run dev'
        : 'Respuesta vacía del servidor'
    )
  }

  let data: Record<string, unknown>

  try {
    data = JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error(
      !response.ok
        ? 'No se pudo conectar con el servidor. Reinicia el proyecto con: npm run dev'
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
