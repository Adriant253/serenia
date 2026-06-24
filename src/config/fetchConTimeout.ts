export async function fetchConTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 45_000
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    timeoutMs
  )

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    })
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'La solicitud tardó demasiado. Si la API estaba dormida, espera unos segundos e intenta de nuevo.'
      )
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}
