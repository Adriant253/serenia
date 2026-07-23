import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  guardarSesionMeditacion
} from '../../services/meditacionService'

import type {
  EstadoMeditacionServidor,
  GuardarSesionMeditacion
} from '../../services/meditacionService'

import type {
  DuracionMeditacion,
  EstadoTemporizador,
  ResultadoTemporizador
} from './meditacionTypes'

import {
  formatearFechaMySQL
} from './meditacionUtils'

interface UseTemporizadorMeditacionProps {
  idUsuario: number | null

  estadoMeditacion:
    EstadoMeditacionServidor | null

  onActualizarEstado: (
    estado:
      EstadoMeditacionServidor
  ) => void

  onRecargarEstado:
    () => Promise<void>
}

interface RegistroPendiente {
  datos:
    GuardarSesionMeditacion

  resultadoBase: Omit<
    ResultadoTemporizador,
    | 'guardada'
    | 'mensaje'
    | 'idMeditacion'
  >
}

export function useTemporizadorMeditacion({
  idUsuario,
  estadoMeditacion,
  onActualizarEstado,
  onRecargarEstado
}: UseTemporizadorMeditacionProps) {
  const [
    duracionSeleccionada,
    setDuracionSeleccionada
  ] = useState<DuracionMeditacion>(
    30
  )

  const [
    segundosRestantes,
    setSegundosRestantes
  ] = useState(30)

  const [
    estado,
    setEstado
  ] = useState<EstadoTemporizador>(
    'listo'
  )

  const [
    resultado,
    setResultado
  ] = useState<
    ResultadoTemporizador | null
  >(null)

  const [
    guardandoSesion,
    setGuardandoSesion
  ] = useState(false)

  const [
    errorGuardado,
    setErrorGuardado
  ] = useState('')

  const fechaInicioRef =
    useRef<Date | null>(null)

  const finalizandoRef =
    useRef(false)

  const guardandoRef =
    useRef(false)

  const registroPendienteRef =
    useRef<RegistroPendiente | null>(
      null
    )

  const esPremium =
    estadoMeditacion
      ?.esPremium ?? false

  const sesionesFreeDisponibles =
    estadoMeditacion
      ?.sesionesDisponibles ?? 0

  const segundosParaDesbloqueo =
    estadoMeditacion
      ?.segundosParaDesbloqueo ?? 0

  const estaBloqueado =
    Boolean(
      estadoMeditacion
        ?.estaBloqueado
    )

  const segundosMeditados =
    Math.max(
      0,
      duracionSeleccionada -
        segundosRestantes
    )

  const progreso =
    useMemo(() => {
      if (
        duracionSeleccionada <= 0
      ) {
        return 0
      }

      return Math.min(
        100,
        Math.max(
          0,
          (
            segundosMeditados /
            duracionSeleccionada
          ) * 100
        )
      )
    }, [
      duracionSeleccionada,
      segundosMeditados
    ])

  const guardarRegistro =
    useCallback(async (
      registro:
        RegistroPendiente
    ) => {
      if (
        guardandoRef.current ||
        !idUsuario
      ) {
        return
      }

      guardandoRef.current = true

      setGuardandoSesion(true)
      setErrorGuardado('')

      try {
        const respuesta =
          await guardarSesionMeditacion(
            registro.datos
          )

        if (respuesta.estado) {
          onActualizarEstado(
            respuesta.estado
          )
        }

        if (!respuesta.exito) {
          const resultadoFallido:
            ResultadoTemporizador = {
              ...registro
                .resultadoBase,

              guardada: false,

              mensaje:
                respuesta.mensaje,

              idMeditacion: null
            }

          setResultado(
            resultadoFallido
          )

          setErrorGuardado(
            respuesta.mensaje
          )

          if (!respuesta.estado) {
            try {
              await onRecargarEstado()
            } catch {
              /*
               * El error principal del
               * guardado ya se muestra.
               */
            }
          }

          return
        }

        registroPendienteRef.current =
          null

        setResultado({
          ...registro
            .resultadoBase,

          guardada: true,

          mensaje:
            respuesta.mensaje,

          idMeditacion:
            respuesta.idMeditacion
        })

      } catch (error) {
        const mensaje =
          error instanceof Error
            ? error.message
            : (
              'No se pudo guardar la sesión'
            )

        setErrorGuardado(
          mensaje
        )

        setResultado({
          ...registro
            .resultadoBase,

          guardada: false,

          mensaje,

          idMeditacion: null
        })

        try {
          await onRecargarEstado()
        } catch {
          /*
           * Se mantiene el mensaje del
           * error de guardado.
           */
        }

      } finally {
        guardandoRef.current =
          false

        finalizandoRef.current =
          false

        setGuardandoSesion(false)
      }
    }, [
      idUsuario,
      onActualizarEstado,
      onRecargarEstado
    ])

  const finalizarYGuardar =
    useCallback((
      completada: boolean,
      duracionRealSegundos: number
    ) => {
      if (
        finalizandoRef.current ||
        !idUsuario
      ) {
        return
      }

      const duracionRealSegura =
        Math.max(
          1,
          Math.min(
            duracionSeleccionada,
            Math.floor(
              duracionRealSegundos
            )
          )
        )

      finalizandoRef.current = true

      setEstado(
        'finalizado'
      )

      const fechaFin =
        new Date()

      const fechaInicio =
        fechaInicioRef.current ??
        new Date(
          fechaFin.getTime() -
          duracionRealSegura * 1000
        )

      const registro:
        RegistroPendiente = {
          datos: {
            duracion_programada_segundos:
              duracionSeleccionada,

            duracion_real_segundos:
              duracionRealSegura,

            completado:
              completada
                ? 1
                : 0,

            fecha_inicio:
              formatearFechaMySQL(
                fechaInicio
              ),

            fecha_fin:
              formatearFechaMySQL(
                fechaFin
              ),

            Usuarios_id_usuario:
              idUsuario
          },

          resultadoBase: {
            duracionProgramadaSegundos:
              duracionSeleccionada,

            duracionRealSegundos:
              duracionRealSegura,

            completada
          }
        }

      registroPendienteRef.current =
        registro

      void guardarRegistro(
        registro
      )
    }, [
      duracionSeleccionada,
      guardarRegistro,
      idUsuario
    ])

  useEffect(() => {
    if (estado !== 'activo') {
      return undefined
    }

    const intervalo =
      window.setInterval(() => {
        setSegundosRestantes(
          (segundosActuales) => {
            return Math.max(
              0,
              segundosActuales - 1
            )
          }
        )
      }, 1000)

    return () => {
      window.clearInterval(
        intervalo
      )
    }
  }, [estado])

  useEffect(() => {
    if (
      estado === 'activo' &&
      segundosRestantes === 0
    ) {
      finalizarYGuardar(
        true,
        duracionSeleccionada
      )
    }
  }, [
    duracionSeleccionada,
    estado,
    finalizarYGuardar,
    segundosRestantes
  ])

  function seleccionarDuracion(
    duracion:
      DuracionMeditacion
  ) {
    if (
      estado === 'activo' ||
      estado === 'pausado' ||
      guardandoSesion
    ) {
      return
    }

    setDuracionSeleccionada(
      duracion
    )

    setSegundosRestantes(
      duracion
    )

    setEstado('listo')
    setResultado(null)
    setErrorGuardado('')

    fechaInicioRef.current =
      null

    registroPendienteRef.current =
      null
  }

  function iniciar() {
    if (
      !idUsuario ||
      !estadoMeditacion ||
      estaBloqueado ||
      guardandoSesion
    ) {
      return
    }

    setSegundosRestantes(
      duracionSeleccionada
    )

    setEstado('activo')
    setResultado(null)
    setErrorGuardado('')

    fechaInicioRef.current =
      new Date()

    registroPendienteRef.current =
      null

    finalizandoRef.current =
      false
  }

  function pausar() {
    if (
      estado !== 'activo' ||
      guardandoSesion
    ) {
      return
    }

    setEstado('pausado')
  }

  function reanudar() {
    if (
      estado !== 'pausado' ||
      estaBloqueado ||
      guardandoSesion
    ) {
      return
    }

    setEstado('activo')
  }

  function reiniciar() {
    if (guardandoSesion) {
      return
    }

    setSegundosRestantes(
      duracionSeleccionada
    )

    setEstado('listo')
    setResultado(null)
    setErrorGuardado('')

    fechaInicioRef.current =
      null

    registroPendienteRef.current =
      null

    finalizandoRef.current =
      false
  }

  function finalizar() {
    if (
      estado !== 'activo' &&
      estado !== 'pausado'
    ) {
      return
    }

    if (guardandoSesion) {
      return
    }

    const duracionReal =
      Math.max(
        0,
        duracionSeleccionada -
          segundosRestantes
      )

    if (duracionReal <= 0) {
      reiniciar()
      return
    }

    finalizarYGuardar(
      false,
      duracionReal
    )
  }

  function prepararOtraSesion() {
    if (guardandoSesion) {
      return
    }

    setSegundosRestantes(
      duracionSeleccionada
    )

    setEstado('listo')
    setResultado(null)
    setErrorGuardado('')

    fechaInicioRef.current =
      null

    registroPendienteRef.current =
      null

    finalizandoRef.current =
      false
  }

  function reintentarGuardado() {
    if (
      guardandoSesion ||
      !registroPendienteRef
        .current
    ) {
      return
    }

    void guardarRegistro(
      registroPendienteRef
        .current
    )
  }

  return {
    duracionSeleccionada,
    segundosRestantes,
    segundosMeditados,
    progreso,
    estado,
    resultado,

    esPremium,
    sesionesFreeDisponibles,
    segundosParaDesbloqueo,
    estaBloqueado,

    guardandoSesion,
    errorGuardado,

    seleccionarDuracion,
    iniciar,
    pausar,
    reanudar,
    reiniciar,
    finalizar,
    prepararOtraSesion,
    reintentarGuardado
  }
}