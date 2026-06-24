export function normalizarMensaje(
  mensaje
) {
  if (!mensaje || typeof mensaje !== 'string') {
    return mensaje
  }

  return mensaje
    .replace(/contraseÃ±a/g, 'contraseña')
    .replace(/ContraseÃ±a/g, 'Contraseña')
    .replace(/sesiÃ³n/g, 'sesión')
    .replace(/SesiÃ³n/g, 'Sesión')
    .replace(/electrÃ³nico/g, 'electrónico')
    .replace(/ElectrÃ³nico/g, 'Electrónico')
    .replace(/mÃ­nimo/g, 'mínimo')
    .replace(/MÃ­nimo/g, 'Mínimo')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
}

export function normalizarRespuestaAuth(
  respuesta
) {
  if (!respuesta || typeof respuesta !== 'object') {
    return respuesta
  }

  const normalizada = { ...respuesta }

  if (typeof normalizada.mensaje === 'string') {
    normalizada.mensaje =
      normalizarMensaje(normalizada.mensaje)
  }

  return normalizada
}
