import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { register } from '../../services/authService'
import {
  validarContrasena,
  validarEmail
} from '../../utils/validations'
import { RUTA_LOGIN_LANDING } from '../../config/authRoutes'
import { normalizarMensaje } from '../../utils/mensajesAuth'

export function registerFunctions() {

  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [fechaNacimiento, setFechaNacimiento] =
    useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] =
    useState('')

  const [errores, setErrores] = useState({
    nombre: '',
    email: '',
    fecha_nacimiento: '',
    contrasena: '',
    confirmar: ''
  })

  const [mostrarModal, setMostrarModal] =
    useState(false)
  const [errorGeneral, setErrorGeneral] =
    useState('')
  const [cargando, setCargando] =
    useState(false)

  const limpiarError = (campo: string) => {
    setErrores(prev => ({
      ...prev,
      [campo]: ''
    }))
    setErrorGeneral('')
  }

  const validarEmailCampo = () => {
    const emailError = validarEmail(email)
    setErrores(prev => ({
      ...prev,
      email: emailError || ''
    }))
  }

  const registrarUsuario = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setErrorGeneral('')

    const nuevosErrores = {
      nombre: '',
      email: validarEmail(email) || '',
      fecha_nacimiento: '',
      contrasena: validarContrasena(contrasena) || '',
      confirmar: ''
    }

    if (!nombre.trim()) {
      nuevosErrores.nombre =
        'El nombre es obligatorio'
    }

    if (!fechaNacimiento) {
      nuevosErrores.fecha_nacimiento =
        'La fecha es obligatoria'
    } else if (
      new Date(fechaNacimiento) > new Date()
    ) {
      nuevosErrores.fecha_nacimiento =
        'La fecha no puede ser futura'
    }

    if (!confirmarContrasena.trim()) {
      nuevosErrores.confirmar =
        'Confirma tu contraseña'
    } else if (
      contrasena !== confirmarContrasena
    ) {
      nuevosErrores.confirmar =
        'Las contraseñas no coinciden'
    }

    if (
      Object.values(nuevosErrores).some(v => v)
    ) {
      setErrores(nuevosErrores)
      return
    }

    setErrores(nuevosErrores)

    try {
      setCargando(true)

      const data = await register(
        nombre,
        email,
        contrasena,
        fechaNacimiento
      ) as {
        success: number
        campo?: string
        mensaje: string
        id_usuario?: number
      }

      if (data.success === 0) {
        const campo = data.campo || 'email'
        const mensaje =
          data.mensaje ||
          'No se pudo completar el registro'

        if (campo === 'email') {
          setErrores(prev => ({
            ...prev,
            email: normalizarMensaje(mensaje)
          }))
        } else {
          setErrores(prev => ({
            ...prev,
            [campo]: normalizarMensaje(mensaje)
          }))
        }

        return
      }

      setMostrarModal(true)

      setTimeout(() => {
        navigate(RUTA_LOGIN_LANDING)
      }, 2000)

    } catch (error) {
      setErrorGeneral(
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

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    fechaNacimiento,
    setFechaNacimiento,
    contrasena,
    setContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
    errores,
    mostrarModal,
    errorGeneral,
    cargando,
    limpiarError,
    validarEmailCampo,
    setErrorGeneral,
    registrarUsuario
  }
}
