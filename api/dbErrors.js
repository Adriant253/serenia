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
  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED') {
    return 'No se pudo conectar con la base de datos. En Render, configura DB_PASSWORD. En Google Cloud SQL, agrega 0.0.0.0/0 en Authorized networks (Connections).'
  }

  if (error?.code === 'ER_CANT_AGGREGATE_2COLLATIONS') {
    return 'Error de configuración en la base de datos (collation). Contacta al administrador.'
  }

  return 'Error al conectar con la base de datos'
}
