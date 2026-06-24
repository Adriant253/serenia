const REEMPLAZOS_MOJIBAKE: [string, string][] = [
  ['contraseÃ±a', 'contraseña'],
  ['ContraseÃ±a', 'Contraseña'],
  ['sesiÃ³n', 'sesión'],
  ['SesiÃ³n', 'Sesión'],
  ['electrÃ³nico', 'electrónico'],
  ['ElectrÃ³nico', 'Electrónico'],
  ['mÃ­nimo', 'mínimo'],
  ['MÃ­nimo', 'Mínimo'],
  ['Ã¡', 'á'],
  ['Ã©', 'é'],
  ['Ã­', 'í'],
  ['Ã³', 'ó'],
  ['Ãº', 'ú'],
  ['Ã±', 'ñ']
]

export function normalizarMensaje(
  mensaje: string | null | undefined
): string {
  if (!mensaje) {
    return ''
  }

  let texto = mensaje

  for (const [malo, bueno] of REEMPLAZOS_MOJIBAKE) {
    texto = texto.split(malo).join(bueno)
  }

  return texto
}

export function mensajeLoginClaro(
  mensaje: string | undefined,
  campo?: string
): string {
  const limpio = normalizarMensaje(mensaje)

  if (limpio) {
    return limpio
  }

  if (campo === 'email') {
    return 'No encontramos una cuenta con ese correo.'
  }

  if (campo === 'contrasena') {
    return 'La contraseña no es correcta.'
  }

  return 'No se pudo iniciar sesión. Revisa tus datos.'
}
