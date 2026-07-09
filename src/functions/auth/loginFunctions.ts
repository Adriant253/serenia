import { useState } from 'react'
import { login } from '../../services/authService'
import { aplicarTema } from '../../services/themeService'
import {
  guardarUsuarioSesion
} from '../../utils/sesionUsuario'
import {
  validarContrasena,
  validarEmail
} from '../../utils/validations'
import {
  mensajeLoginClaro,
  normalizarMensaje
} from '../../utils/mensajesAuth'

export function loginFunctions() {

  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [errores, setErrores] = useState({
    email: '',
    contrasena: ''
  })

  const limpiarError = (
    campo: 'email' | 'contrasena'
  ) => {
    setErrores(prev => ({
      ...prev,
      [campo]: ''
    }))
    setMensaje('')
  }

  const validarEmailCampo = () => {
    const emailError = validarEmail(email)
    setErrores(prev => ({
      ...prev,
      email: emailError || ''
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setMensaje('')

    const emailError = validarEmail(email)
    const contrasenaError =
      validarContrasena(contrasena)

    if (emailError || contrasenaError) {
      setErrores({
        email: emailError || '',
        contrasena: contrasenaError || ''
      })
      return
    }

    setErrores({ email: '', contrasena: '' })

    try {
      setCargando(true)

      const data = await login(
        email,
        contrasena
      ) as {
        success: number
        mensaje: string
        campo?: string
        id_usuario: number
        nombre: string
        email: string
        fecha_nacimiento: string
        fecha_registro: string
      }

      if (data.success === 1) {
        const {
          success: _success,
          mensaje: _mensaje,
          ...usuario
        } = data

        guardarUsuarioSesion(usuario)
        aplicarTema('dark')

        window.location.href =
          '/dashboard/inicio'
        return
      }

      const mensajeError = mensajeLoginClaro(
        data.mensaje,
        data.campo
      )

      if (data.campo === 'email') {
        setErrores({
          email: mensajeError,
          contrasena: ''
        })
        setMensaje('')
        return
      }

      if (data.campo === 'contrasena') {
        setErrores({
          email: '',
          contrasena: mensajeError
        })
        setMensaje('')
        return
      }

      setErrores({ email: '', contrasena: '' })
      setMensaje(mensajeError)

    } catch (error) {
      console.error('Error Login:', error)

      setErrores({ email: '', contrasena: '' })
      setMensaje(
        normalizarMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo conectar con el servidor'
        )
      )

    } finally {
      setCargando(false)
    }
  }

  return {
    email,
    setEmail,
    contrasena,
    setContrasena,
    errores,
    mensaje,
    cargando,
    limpiarError,
    validarEmailCampo,
    handleSubmit
  }
}
