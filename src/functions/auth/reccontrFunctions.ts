import { validarEmail } from '../../utils/validations'
import { normalizarMensaje } from '../../utils/mensajesAuth'
import {
  solicitarRecuperacion
} from '../../services/recuperacionService'

export function generarToken() {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let token = ''

  for (let i = 0; i < 8; i++) {
    token += caracteres.charAt(
      Math.floor(
        Math.random() * caracteres.length
      )
    )
  }

  return token
}

export async function solicitarTokenRecuperacion(
  correo: string,
  setMensaje: (mensaje: string) => void,
  setEsExito: (esExito: boolean) => void,
  navigate: (ruta: string) => void,
  setCargando: (cargando: boolean) => void,
  setErrorEmail?: (error: string) => void
) {

  const emailError = validarEmail(correo)

  if (emailError) {
    setEsExito(false)
    setMensaje('')
    setErrorEmail?.(emailError)
    return
  }

  setErrorEmail?.('')

  try {
    setCargando(true)
    setEsExito(false)

    const token = generarToken()

    const resultado =
      await solicitarRecuperacion(
        correo,
        token
      ) as {
        success: number
        mensaje: string
      }

    if (resultado.success === 1) {
      localStorage.setItem(
        'correoRecuperacion',
        correo.trim()
      )

      setEsExito(true)
      setMensaje(
        resultado.mensaje ||
        'Revisa tu correo e ingresa el código'
      )

      setTimeout(() => {
        navigate('/cambiar-contrasena')
      }, 2500)

    } else {
      setMensaje(
        normalizarMensaje(
          resultado.mensaje ||
          'No se encontró una cuenta con ese correo'
        )
      )
    }

  } catch (error) {
    setMensaje(
      normalizarMensaje(
        error instanceof Error
          ? error.message
          : 'Error al conectar con el servidor'
      )
    )

  } finally {
    setCargando(false)
  }
}
