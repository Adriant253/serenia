import { revisarVariablesEntorno } from './envConfig.js'

const CODIGOS_ERROR_BD = new Set([
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'PROTOCOL_CONNECTION_LOST',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
  'ER_CANT_AGGREGATE_2COLLATIONS'
])

export function esErrorConexionDb(error) {
  return CODIGOS_ERROR_BD.has(error?.code)
}

export function mensajeErrorBd(error) {
  const envListo = revisarVariablesEntorno().listo

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED') {
    if (envListo) {
      return 'Cloud SQL bloquea la conexión desde Render. En Google Cloud Console → SQL → Connections → Authorized networks, agrega 0.0.0.0/0 y guarda.'
    }

    return 'No se pudo conectar con la base de datos. Configura DB_PASSWORD en Render y abre Authorized networks en Cloud SQL.'
  }

  if (error?.code === 'ER_ACCESS_DENIED_ERROR') {
    return 'Usuario o contraseña de la base de datos incorrectos. Revisa DB_USER y DB_PASSWORD en Render.'
  }

  if (error?.code === 'ER_CANT_AGGREGATE_2COLLATIONS') {
    return 'Error de configuración en la base de datos (collation). Contacta al administrador.'
  }

  return 'Error al conectar con la base de datos'
}
