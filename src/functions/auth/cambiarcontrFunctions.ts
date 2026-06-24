import {
  cambiarContrasenaService
}
from '../../services/recuperacionService'
import { RUTA_LOGIN_LANDING } from '../../config/authRoutes'

export async function cambiarContrasena(

  token: string,

  nuevaPassword: string,

  confirmarPassword: string,

  setMensaje: (
    mensaje: string
  ) => void,

  setCargando: (
    cargando: boolean
  ) => void,

  navigate: (
    ruta: string
  ) => void,

  setEsExito: (
    valor: boolean
  ) => void,

  setMostrarModal: (
    valor: boolean
  ) => void

) {

  const email =
    localStorage.getItem(
      'correoRecuperacion'
    ) || ''

  if (!email.trim()) {

    setEsExito(false)

    setMensaje(
      'No se encontró el correo de recuperación'
    )

    setTimeout(() => {

      setMensaje('')

    }, 2000)

    return

  }

  if (!token.trim()) {

    setEsExito(false)

    setMensaje(
      'Ingresa el token'
    )

    setTimeout(() => {

      setMensaje('')

    }, 2000)

    return

  }

  if (!nuevaPassword.trim()) {

    setEsExito(false)

    setMensaje(
      'Ingresa una nueva contraseña'
    )

    setTimeout(() => {

      setMensaje('')

    }, 2000)

    return

  }

  if (nuevaPassword.length < 8) {

    setEsExito(false)

    setMensaje(
      'La contraseña debe tener mínimo 8 caracteres'
    )

    setTimeout(() => {

      setMensaje('')

    }, 3000)

    return

  }

  if (!confirmarPassword.trim()) {

    setEsExito(false)

    setMensaje(
      'Confirma la contraseña'
    )

    setTimeout(() => {

      setMensaje('')

    }, 2000)

    return

  }

  if (

    nuevaPassword !==
    confirmarPassword

  ) {

    setEsExito(false)

    setMensaje(
      'Las contraseñas no coinciden'
    )

    setTimeout(() => {

      setMensaje('')

    }, 3000)

    return

  }

  try {

    setCargando(true)

    const resultado =
      await cambiarContrasenaService(

        email,
        token,
        nuevaPassword

      ) as {
        success: number
        mensaje: string
      }

    if (
      resultado.success === 1
    ) {

      setEsExito(true)

      setMensaje(
        resultado.mensaje
      )

      setMostrarModal(true)

      localStorage.removeItem(
        'correoRecuperacion'
      )

      setTimeout(() => {

        navigate(RUTA_LOGIN_LANDING)

      }, 3000)

    }

    else {

      setEsExito(false)

      setMensaje(
        resultado.mensaje
      )

      setTimeout(() => {

        setMensaje('')

      }, 2000)

    }

  }

  catch (error) {

    setEsExito(false)

    setMensaje(
      error instanceof Error
        ? error.message
        : 'Error al conectar con el servidor'
    )

    setTimeout(() => {

      setMensaje('')

    }, 3000)

  }

  finally {

    setCargando(false)

  }

}