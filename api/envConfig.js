const variablesRequeridas = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
]

const variablesOpcionales = [
  'FRONTEND_URL',
  'GOOGLE_CALLBACK_URL',
  'MAIL_USER',
  'MAIL_PASS'
]

export function correoListo() {
  return Boolean(
    process.env.MAIL_USER?.trim() &&
    process.env.MAIL_PASS?.trim()
  )
}

export function revisarVariablesEntorno() {
  const faltantes = variablesRequeridas.filter(
    (nombre) => !process.env[nombre]?.trim()
  )

  const opcionalesFaltantes = variablesOpcionales.filter(
    (nombre) => !process.env[nombre]?.trim()
  )

  return {
    faltantes,
    opcionalesFaltantes,
    listo: faltantes.length === 0
  }
}

export function imprimirEstadoEntorno() {
  const { faltantes, opcionalesFaltantes, listo } =
    revisarVariablesEntorno()

  if (listo) {
    console.log('Variables de entorno: OK')
    return
  }

  console.warn('Variables de entorno faltantes en el servidor:')
  faltantes.forEach((nombre) => {
    console.warn(`  - ${nombre}`)
  })

  if (opcionalesFaltantes.length > 0) {
    console.warn('Variables opcionales no configuradas:')
    opcionalesFaltantes.forEach((nombre) => {
      console.warn(`  - ${nombre}`)
    })
  }
}
