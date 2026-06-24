import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
)

export async function verificarTokenGoogle(
  credential
) {

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error(
      'GOOGLE_CLIENT_ID no configurado en el servidor'
    )
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  const payload = ticket.getPayload()

  if (!payload?.email) {
    throw new Error(
      'Token de Google inválido'
    )
  }

  return {
    email: payload.email,
    nombre: payload.name || payload.email.split('@')[0],
    googleId: payload.sub,
    foto: payload.picture || null
  }

}

export async function loginORegistrarGoogle(
  pool,
  datosGoogle
) {

  const { email, nombre } = datosGoogle

  const emailNorm = email.trim().toLowerCase()

  const [existentes] = await pool.query(
    `SELECT id_usuario, nombre, email, fecha_nacimiento, fecha_registro
     FROM usuarios
     WHERE LOWER(TRIM(email)) = ?
     LIMIT 1`,
    [emailNorm]
  )

  if (existentes.length > 0) {
    const usuario = existentes[0]

    return {
      success: 1,
      mensaje: 'Inicio de sesión exitoso',
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      fecha_nacimiento: usuario.fecha_nacimiento,
      fecha_registro: usuario.fecha_registro
    }
  }

  const fechaDefault = '2000-01-01'
  const contrasenaGoogle =
    `google_${datosGoogle.googleId}`

  const [resultado] = await pool.query(
    'CALL spRegistrarUsuario(?, ?, ?, ?)',
    [nombre, email, contrasenaGoogle, fechaDefault]
  )

  const respuesta = resultado[0][0]

  if (respuesta.success === 0) {
    const [reintento] = await pool.query(
      `SELECT id_usuario, nombre, email, fecha_nacimiento, fecha_registro
       FROM usuarios
       WHERE LOWER(TRIM(email)) = ?
       LIMIT 1`,
      [emailNorm]
    )

    if (reintento.length > 0) {
      const usuario = reintento[0]

      return {
        success: 1,
        mensaje: 'Inicio de sesión exitoso',
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_nacimiento: usuario.fecha_nacimiento,
        fecha_registro: usuario.fecha_registro
      }
    }

    return respuesta
  }

  return {
    success: 1,
    mensaje: 'Cuenta creada con Google',
    id_usuario: respuesta.id_usuario,
    nombre,
    email,
    fecha_nacimiento: fechaDefault,
    fecha_registro: new Date().toISOString()
  }

}
