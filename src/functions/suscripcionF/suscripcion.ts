import {
  useState
} from 'react'

import {
  activarUsuarioPremium
} from '../../services/suscripService'

export interface UsuarioSuscripcion {
  id_usuario: number
  nombre: string
  email: string
  estado_suscripcion?: string
  fecha_nacimiento?: string
  fecha_registro?: string
}

export interface DatosPagoSuscripcion {
  nombreTitular: string
  numeroTarjeta: string
  vencimiento: string
  cvv: string
}

export interface ErroresPagoSuscripcion {
  nombreTitular?: string
  numeroTarjeta?: string
  vencimiento?: string
  cvv?: string
}

function obtenerUsuarioGuardado():
  UsuarioSuscripcion | null {
  try {
    const usuarioTexto =
      localStorage.getItem(
        'usuario'
      )

    if (!usuarioTexto) {
      return null
    }

    const usuario =
      JSON.parse(
        usuarioTexto
      ) as UsuarioSuscripcion

    if (
      !usuario ||
      !usuario.id_usuario
    ) {
      return null
    }

    return usuario

  } catch {
    return null
  }
}

function normalizarEstadoSuscripcion(
  estado?: string
) {
  return String(
    estado || 'free'
  )
    .trim()
    .toLowerCase()
}

function validarUsuarioPremium(
  estado?: string
) {
  const estadoNormalizado =
    normalizarEstadoSuscripcion(
      estado
    )

  return (
    estadoNormalizado ===
      'premium' ||
    estadoNormalizado ===
      'premiun'
  )
}

function soloDigitos(valor: string) {
  return valor.replace(/\D/g, '')
}

function formatearNumeroTarjeta(valor: string) {
  const digitos = soloDigitos(valor).slice(0, 16)

  return digitos.replace(
    /(\d{4})(?=\d)/g,
    '$1 '
  )
}

function formatearVencimiento(valor: string) {
  const digitos = soloDigitos(valor).slice(0, 4)

  if (digitos.length <= 2) {
    return digitos
  }

  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
}

function validarDatosPago(
  datos: DatosPagoSuscripcion
): ErroresPagoSuscripcion {
  const errores: ErroresPagoSuscripcion = {}

  const nombre = datos.nombreTitular.trim()
  const numero = soloDigitos(datos.numeroTarjeta)
  const vencimiento = soloDigitos(datos.vencimiento)
  const cvv = soloDigitos(datos.cvv)

  if (nombre.length < 3) {
    errores.nombreTitular =
      'Ingresa el nombre del titular.'
  }

  if (numero.length < 15 || numero.length > 16) {
    errores.numeroTarjeta =
      'Ingresa un número de tarjeta válido.'
  }

  if (vencimiento.length !== 4) {
    errores.vencimiento =
      'Usa el formato MM/AA.'
  } else {
    const mes = Number(vencimiento.slice(0, 2))
    const anio = Number(vencimiento.slice(2))
    const ahora = new Date()
    const anioActual = ahora.getFullYear() % 100
    const mesActual = ahora.getMonth() + 1

    if (mes < 1 || mes > 12) {
      errores.vencimiento =
        'El mes de vencimiento no es válido.'
    } else if (
      anio < anioActual ||
      (anio === anioActual && mes < mesActual)
    ) {
      errores.vencimiento =
        'La tarjeta está vencida.'
    }
  }

  if (cvv.length < 3 || cvv.length > 4) {
    errores.cvv =
      'Ingresa un CVV de 3 o 4 dígitos.'
  }

  return errores
}

export function useSuscripcion() {
  const [
    usuario,
    setUsuario
  ] = useState<
    UsuarioSuscripcion | null
  >(() => {
    return obtenerUsuarioGuardado()
  })

  const [
    cargando,
    setCargando
  ] = useState(false)

  const [
    pagoCompletado,
    setPagoCompletado
  ] = useState(false)

  const [
    mensaje,
    setMensaje
  ] = useState('')

  const [
    error,
    setError
  ] = useState('')

  const [
    datosPago,
    setDatosPago
  ] = useState<DatosPagoSuscripcion>({
    nombreTitular: '',
    numeroTarjeta: '',
    vencimiento: '',
    cvv: ''
  })

  const [
    erroresPago,
    setErroresPago
  ] = useState<ErroresPagoSuscripcion>({})

  const estadoSuscripcion =
    normalizarEstadoSuscripcion(
      usuario?.estado_suscripcion
    )

  const esPremium =
    validarUsuarioPremium(
      usuario?.estado_suscripcion
    )

  function actualizarCampoPago(
    campo: keyof DatosPagoSuscripcion,
    valor: string
  ) {
    let valorFormateado = valor

    if (campo === 'numeroTarjeta') {
      valorFormateado =
        formatearNumeroTarjeta(valor)
    }

    if (campo === 'vencimiento') {
      valorFormateado =
        formatearVencimiento(valor)
    }

    if (campo === 'cvv') {
      valorFormateado =
        soloDigitos(valor).slice(0, 4)
    }

    setDatosPago((prev) => ({
      ...prev,
      [campo]: valorFormateado
    }))

    setErroresPago((prev) => ({
      ...prev,
      [campo]: undefined
    }))

    setError('')
  }

  async function realizarPagoSimulado() {
    if (!usuario) {
      setError(
        'No se encontró un usuario con sesión iniciada.'
      )

      return
    }

    const idUsuario =
      Number(
        usuario.id_usuario
      )

    if (
      !Number.isInteger(idUsuario) ||
      idUsuario <= 0
    ) {
      setError(
        'El identificador del usuario no es válido.'
      )

      return
    }

    if (esPremium) {
      setError('')

      setMensaje(
        'Tu cuenta ya tiene una suscripción Premium.'
      )

      setPagoCompletado(
        true
      )

      return
    }

    const erroresValidacion =
      validarDatosPago(datosPago)

    if (
      Object.keys(erroresValidacion).length > 0
    ) {
      setErroresPago(erroresValidacion)
      setError(
        'Revisa los datos del método de pago.'
      )
      return
    }

    try {
      setCargando(true)
      setError('')
      setMensaje('')

      const respuesta =
        await activarUsuarioPremium({
          id_usuario:
            idUsuario
        })

      if (
        Number(
          respuesta.success
        ) === 0
      ) {
        setError(
          respuesta.mensaje ||
          'No se pudo activar la suscripción.'
        )

        return
      }

      const usuarioActualizado:
        UsuarioSuscripcion = {
          ...usuario,

          id_usuario:
            respuesta.id_usuario !==
              null
              ? Number(
                  respuesta.id_usuario
                )
              : usuario.id_usuario,

          nombre:
            respuesta.nombre ||
            usuario.nombre,

          email:
            respuesta.email ||
            usuario.email,

          estado_suscripcion:
            respuesta
              .estado_suscripcion ||
            'premium'
        }

      localStorage.setItem(
        'usuario',
        JSON.stringify(
          usuarioActualizado
        )
      )

      localStorage.setItem(
        'id_usuario',
        String(
          usuarioActualizado.id_usuario
        )
      )

      setUsuario(
        usuarioActualizado
      )

      setPagoCompletado(
        true
      )

      setDatosPago({
        nombreTitular: '',
        numeroTarjeta: '',
        vencimiento: '',
        cvv: ''
      })

      setErroresPago({})

      setMensaje(
        respuesta.mensaje ||
        'Tu suscripción Premium fue activada correctamente.'
      )

      window.dispatchEvent(
        new CustomEvent(
          'usuario-actualizado',
          {
            detail:
              usuarioActualizado
          }
        )
      )

    } catch (errorPeticion) {
      console.error(
        'Error activando Premium:',
        errorPeticion
      )

      if (
        errorPeticion instanceof
        Error
      ) {
        setError(
          errorPeticion.message
        )
      } else {
        setError(
          'No se pudo completar el pago.'
        )
      }

    } finally {
      setCargando(false)
    }
  }

  return {
    usuario,

    estadoSuscripcion,
    esPremium,

    cargando,
    pagoCompletado,

    mensaje,
    error,

    datosPago,
    erroresPago,
    actualizarCampoPago,

    realizarPagoSimulado
  }
}
