import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import {
  obtenerEstadoMeditacion
} from '../../services/meditacionService'

import type {
  EstadoMeditacionServidor
} from '../../services/meditacionService'

export function useEstadoMeditacion(
  idUsuario: number | null
) {
  const [
    estadoMeditacion,
    setEstadoMeditacion
  ] = useState<
    EstadoMeditacionServidor | null
  >(null)

  const [
    cargandoEstado,
    setCargandoEstado
  ] = useState(false)

  const [
    errorEstado,
    setErrorEstado
  ] = useState('')

  const recargandoDesbloqueoRef =
    useRef(false)

  const cargarEstado =
    useCallback(async () => {
      if (
        !idUsuario ||
        idUsuario <= 0
      ) {
        setEstadoMeditacion(null)

        setErrorEstado(
          'No se encontró un usuario activo'
        )

        return
      }

      setCargandoEstado(true)
      setErrorEstado('')

      try {
        const estado =
          await obtenerEstadoMeditacion(
            idUsuario
          )

        setEstadoMeditacion(
          estado
        )

      } catch (error) {
        setErrorEstado(
          error instanceof Error
            ? error.message
            : (
              'No se pudo consultar el estado de meditación'
            )
        )

      } finally {
        setCargandoEstado(false)
      }
    }, [idUsuario])

  useEffect(() => {
    void cargarEstado()
  }, [cargarEstado])

  useEffect(() => {
    if (
      !estadoMeditacion
        ?.estaBloqueado ||
      estadoMeditacion
        .segundosParaDesbloqueo <= 0
    ) {
      return undefined
    }

    const intervalo =
      window.setInterval(() => {
        setEstadoMeditacion(
          (estadoActual) => {
            if (
              !estadoActual ||
              !estadoActual
                .estaBloqueado
            ) {
              return estadoActual
            }

            const nuevosSegundos =
              Math.max(
                0,
                estadoActual
                  .segundosParaDesbloqueo -
                  1
              )

            if (
              nuevosSegundos === 0 &&
              !recargandoDesbloqueoRef
                .current
            ) {
              recargandoDesbloqueoRef
                .current = true

              window.setTimeout(
                async () => {
                  try {
                    await cargarEstado()
                  } finally {
                    recargandoDesbloqueoRef
                      .current = false
                  }
                },
                0
              )
            }

            return {
              ...estadoActual,

              segundosParaDesbloqueo:
                nuevosSegundos
            }
          }
        )
      }, 1000)

    return () => {
      window.clearInterval(
        intervalo
      )
    }
  }, [
    cargarEstado,
    estadoMeditacion?.estaBloqueado
  ])

  const actualizarEstadoMeditacion =
    useCallback((
      nuevoEstado:
        EstadoMeditacionServidor
    ) => {
      setEstadoMeditacion(
        nuevoEstado
      )

      setErrorEstado('')
      setCargandoEstado(false)
    }, [])

  return {
    estadoMeditacion,
    cargandoEstado,
    errorEstado,
    cargarEstado,
    actualizarEstadoMeditacion
  }
}